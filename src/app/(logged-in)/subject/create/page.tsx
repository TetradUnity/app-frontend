'use client'

import Foreground from "@/components/Foreground";
import Tiptap, { TiptapRef } from "@/components/Tiptap";
import { TestConstructor, TestConstructorRef } from "@/components/tests/TestConstructor";
import { ChiefTeacherService } from "@/services/chief_teacher.service";
import { useProfileStore } from "@/stores/profileStore";
import { CreateSubjectParams, Drafts } from "@/types/api.types";
import { differenceBetweenTwoDatesInSec, formatTimeInSeconds } from "@/utils/TimeUtils";
import { AutoComplete, Button, DatePicker, Form, FormInstance, GetRef, Input, InputRef, Modal, Select, Spin, Switch, Tag, Tooltip, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import debounce from 'lodash/debounce';
import translateRequestError from "@/utils/ErrorUtils";

import { PlusOutlined } from "@ant-design/icons";
import { HookAPI } from "antd/es/modal/useModal";
import { TweenOneGroup } from "rc-tween-one";
import { DraftService } from "@/services/draft.service";
import { countCharactersInHTML } from "@/utils/StringUtils";

const draftStore = DraftService.createStore<Drafts.SubjectParams>("subject_create_draft");

const TeacherSelector = function({setTeacherModalVisible} : any) {
    const [options, setOptions] = useState<{value: string}[]>([]);

    const [isFetching, setIsFetching] = useState(false);

    const search = async (text: string) => {
        if (text.length < 2) {
            setIsFetching(false);
            return [];
        }

        setIsFetching(true);
        setOptions([]);

        const response = await ChiefTeacherService.findTeacherByEmail(text);

        setIsFetching(false);

        if (response.data) {
            return response.data.map(user => ({
                label: `${user.email} (${user.first_name} ${user.last_name})`,
                value: user.email,
            })) 
        }

        return [];
    }

    const autoComplete = useRef<GetRef<typeof Select>>(null);

    return (
        <Form.Item
            name="teacher"
            label="Вчитель (email):"
            rules={[
                { required: true, message: "Обов'язкове поле!" },
            ]}
        >
            <AutoComplete
                options={options}
                onSearch={debounce(async (text: string) => setOptions(await search(text)), 400)}
                ref={autoComplete}
                notFoundContent={
                    isFetching
                        ? <Spin style={{display: "block", margin: "auto"}} />
                        : <>
                            <h3>Здається, вчитель з таким email ще не доданий в систему.</h3>
                            <Button onClick={() => {
                                autoComplete.current?.blur();
                                setTeacherModalVisible(true);
                            }}>Створити</Button>
                        </>
                }
            />
        </Form.Item>
    )
}

const TeacherCreationForm = ({teacherModalVisible, setTeacherModalVisible, mainForm} : {
    teacherModalVisible: boolean, setTeacherModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
    mainForm: FormInstance<any>
}) => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [api, ctx] = message.useMessage();

    const onSubmit = () => {
        setLoading(true);

        ChiefTeacherService.createUser(
            form.getFieldValue("firstName"),
            form.getFieldValue("lastName"),
            form.getFieldValue("email"),
            form.getFieldValue("password"),
            "TEACHER"
        ).then(res => {
            setLoading(false);

            if (!res.success) {
                api.error("Трапилась помилка: " + translateRequestError(res.error_code));
                return;
            }

            api.success("Успішно!");
            mainForm.setFieldValue("teacher", form.getFieldValue("email"));
            mainForm.validateFields();
            setTeacherModalVisible(false);
        })
    }

    return (
        <Modal
            title="Зареєструвати вчителя"
            closable={false}
            open={teacherModalVisible}
            footer={null}
            maskClosable={false}
            zIndex={1000}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onSubmit}
            >
                <Form.Item name="firstName" label="Ім'я:" rules={[
                    { required: true, message: "Обов'язкове поле!" },
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item name="lastName" label="Фамілія:" rules={[
                    { required: true, message: "Обов'язкове поле!" },
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email:" rules={[
                    { required: true, message: "Обов'язкове поле!" },
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item required label="Пароль:">
                    <Form.Item name="password" rules={[
                        { required: true, message: "Обов'язкове поле!" },
                    ]} noStyle>
                        <Input type="password" />
                    </Form.Item>
                    <p>Вчитель зможе змінити свій пароль в будь який час.</p>
                </Form.Item>

                <Form.Item>
                    <Button style={{display: "block", margin: "auto"}} loading={loading} htmlType="submit" type="primary">Зареєструвати</Button>
                </Form.Item>

                <Form.Item>
                    <Button style={{display: "block", margin: "auto"}} onClick={() => setTeacherModalVisible(false)} type="dashed">Скасувати</Button>
                </Form.Item>
            </Form>
            {ctx}
        </Modal>
    )
}

type TagsSelectorRef = {
    getTags: () => string[],
    setTags: (tags: string[]) => void
}

const TagsSelector = React.forwardRef(({modal} : {modal: HookAPI}, ref) => {
    const [tags, setTags] = useState<string[]>([]);
    
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = React.useRef<InputRef>(null);

    useImperativeHandle(ref, () => ({
        getTags: () => tags,
        setTags: tags => setTags(tags)
    }) as TagsSelectorRef);

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    }

    const onInputConfirm = () => {
        let tag = inputValue.trim();
        if (tag.length > 0 && tags.indexOf(tag) === -1) {
            setTags([...tags, tag]);
        }

        setInputVisible(false);
        setInputValue('');
    }

    const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        let value = e.target.value.substring(0, 20);
        setInputValue(value);

        let input = inputRef.current?.input
        if (input) {
            input.style.width = value.length + 3 + "ch"
        }
    }

    const showInput = () => {
        if (tags.length == 5) {
            return;
        }
        setInputVisible(true);
    }

    return (
        <div style={{margin: "20px 0"}}>
            <p>Теги:</p>

           <TweenOneGroup
                appear={false}
                enter={{ scale: 0.8, opacity: 0, type: 'from', duration: 100 }}
                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                style={{display: "inline-block"}}
                onEnd={(e) => {
                    if (e.type === 'appear' || e.type === 'enter') {
                    (e.target as any).style = 'display: inline-block';
                    }
                }}
            >
                {tags.map(tag => 
                   <span key={tag} style={{display: "inline-block"}}>
                        <Tag
                            closable
                            onClose={(e) => {
                                e.preventDefault();
                                removeTag(tag)
                            }}
                        >
                            {tag}
                        </Tag>
                   </span>
                )}
            </TweenOneGroup>

           {
            inputVisible

            ? <Input
                ref={inputRef}
                type="text"
                size="small"
                style={{width: 0, minWidth: 90, maxWidth: 200, height: 25}}
                value={inputValue}
                onChange={onInputChange}
                onBlur={onInputConfirm}
                onPressEnter={onInputConfirm}
            />

            :  <Tooltip
                    title={tags.length == 5 ? "Прикріпити можна максимум 5 тегів." : ""}
                    arrow
                    style={{display: "inline-block"}}
                >
                    <Tag
                        onClick={showInput}
                        style={{
                            borderStyle: "dashed",
                            cursor: tags.length == 5 ? "not-allowed" : "pointer",
                            display: "inline-block"
                        }}
                        color={tags.length == 5 ? "cyan" : "cyan-inverse"}
                    >
                        <PlusOutlined /> Новий тег
                    </Tag>
                </Tooltip>
           }
        </div>
    )
})

export default function CreateSubjectPage() {
    const role = useProfileStore(useShallow(selector => selector.role));
    const { replace } = useRouter();
    if (role != "CHIEF_TEACHER") {
        replace("/");
        return null;
    }

    const [form] = Form.useForm();
    const [modal, modalCtxHolder] = Modal.useModal();

    const [teacherModalVisible, setTeacherModalVisible] = useState(false);
    const [testSelectorVisible, setTestSelectorVisible] = useState(false);

    const [duration, setDuration] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([dayjs(), dayjs().add(1, 'month')]);

    const testRef = useRef<TestConstructorRef>();

    const [isLoading, setLoading] = useState(false);

    const descRef = useRef<TiptapRef>();

    const { push } = useRouter();

    const tagsRef = useRef<TagsSelectorRef>();

    const isDraftModalVisible = React.useRef<boolean>();

    const err = (err: string) => {
        modal.error({
            title: "Помилка.",
            maskClosable: true,
            content: err
        })
    }

    const onSubmit = () => {
        if (isLoading) return;

        modal.confirm({
            title: "Підтвердження",
            content: <p>Всі поля заповнені правильно щоб створити предмет?</p>,
            onOk: () => {
                let data = getData();
                if (!data) {
                    err("Спробуйте ще раз.");
                    return;
                }
                

                let examEnabled = form.getFieldValue("examEndDate") !== undefined;

                let exam = data.exam;
                if (testRef.current && examEnabled) {
                    if (exam == undefined) {
                        err("Спробуйте ще раз.");
                        return;
                    }
                }

                let start_subject_time = data.start;
                let end_exam_time = data.exam_end;
                
                let current_time = Date.now();

                if (start_subject_time < current_time) {
                    err("Дата початку предмету має бути після поточної дати.");
                    return;
                }

                if (end_exam_time) {
                    if (end_exam_time > start_subject_time) {
                        err("Дата закінчення екзамену не може бути назначеною після того як почнеться предмет.");
                        return;
                    }

                    if (end_exam_time < current_time + (7 * 86400 * 1000)) {
                        err("Дата закінчення екзамену має бути назначена як мінімум через неділю від поточної дати.")
                        return;
                    }

                    if (start_subject_time - end_exam_time < 86400 * 1000) {
                        err("Різниця між датою закінчення екзамену та початком предмету має бути як мінімум 1 день.");
                        return;
                    }
                }

                if (countCharactersInHTML(data.description) < 100) {
                    err("Кількість символів в описі має бути як мінімум 100.");
                    return;
                }

                if (data.duration < 3 * 24 * 3600 * 1000) {
                    err("Тривалість предмету має бути як мінімум 3 дня.");
                    return;
                }

                setLoading(true);

                ChiefTeacherService.createSubject(data).then(resp => {
                    setLoading(false);
                    if (!resp.success) {
                        err("Не вдалось створити предмет: " + translateRequestError(resp.error_code));
                        return;
                    }

                    modal.success({
                        title: "Успіх!",
                        maskClosable: true,
                        content: "Тільки що ви створили новий предмет.",
                        onOk: () => {
                            draftStore.remove();
                            push("/subject/announced/" + resp.subject_id);
                        }
                    })
                })
            }
        })
    }

    const getData = () => {
        let examEnabled = form.getFieldValue("examEndDate") !== undefined;
        let exam = undefined;
        if (testRef.current && examEnabled) {
            exam = testRef.current.getData();
            if (!exam) {
                return;
            }
            exam = JSON.stringify(exam);
        }

        let start_subject_time = form.getFieldValue("startDate") ? form.getFieldValue("startDate").unix() * 1000 : -1;
        let end_exam_time = examEnabled ? (form.getFieldValue("examEndDate").unix() * 1000) : undefined;
        let descEditor = descRef.current?.getEditor();
        if (!(descEditor && tagsRef.current)) {
            return;
        }

        let info: CreateSubjectParams = {
            title: form.getFieldValue("title"),
            description: descEditor.getHTML(),
            short_description: form.getFieldValue("short_desc"),
            start: start_subject_time,
            exam_end: end_exam_time,
            duration: differenceBetweenTwoDatesInSec(duration[0], duration[1]) * 1000,
            timetable: form.getFieldValue("timetable"),
            tags: tagsRef.current.getTags(),
            exam: exam,
            teacherEmail: form.getFieldValue("teacher")
        }
        return info;
    }

    const saveDraft = () => {
        let descEditor = descRef.current?.getEditor();

        let exam = undefined;
        if (testRef.current && form.getFieldValue("isExamRequired")) {
            exam = testRef.current.getDataAsDraft();
        }

        draftStore.save({
            title: form.getFieldValue("title"),
            description: descEditor?.getHTML(),
            short_description: form.getFieldValue("short_desc"),
            start: form.getFieldValue("startDate") && (form.getFieldValue("startDate").unix() * 1000) || undefined,
            exam_end: form.getFieldValue("examEndDate") ? (form.getFieldValue("examEndDate").unix() * 1000) : undefined,
            duration_dayjs: [duration[0]?.unix(), duration[1]?.unix()],
            timetable: form.getFieldValue("timetable"),
            tags: tagsRef.current?.getTags(),
            exam_plain: exam,
            teacherEmail: form.getFieldValue("teacher"),
            isExamRequired: form.getFieldValue("isExamRequired")
        })
    }

    const loadFromDraft = (draft: Drafts.SubjectParams) => {
        form.setFieldValue("title", draft.title);
        form.setFieldValue("short_desc", draft.short_description);
        form.setFieldValue("timetable", draft.timetable);
        form.setFieldValue("teacher", draft.teacherEmail);
        form.setFieldValue("isExamRequired", draft.isExamRequired);
        setTestSelectorVisible(draft.isExamRequired == true);
        
        tagsRef.current?.setTags(draft.tags || []);

        if (draft.start) {
            form.setFieldValue("startDate", dayjs(draft.start));
        }
        if (draft.exam_end) {
            form.setFieldValue("examEndDate", dayjs(draft.exam_end));
        }
        if (draft.duration_dayjs && (draft.duration_dayjs[0] && draft.duration_dayjs[1])) {
            setDuration([dayjs(draft.duration_dayjs[0] * 1000), dayjs(draft.duration_dayjs[1] * 1000)]);
        }
        if (draft.exam_plain) {
            let id = setInterval(() => {
                if (!testRef.current) {
                    return;
                }
                if (draft.exam_plain) {
                    testRef.current.loadFromDraft(draft.exam_plain);
                }
                clearInterval(id);
            }, 10);
        }

        if (draft.description) {
            let id = setInterval(() => {
                let editor = descRef.current?.getEditor();
                
                if (!editor) {
                    return;
                }
    
                editor.commands.setContent(draft.description as string);
                clearInterval(id);
            }, 10);
        }
    }

    useEffect(() => {
        let modalInstance = null;
        if (draftStore.isExist()) {
            isDraftModalVisible.current = true;
            modalInstance = modal.confirm({
                title: "Чернетка",
                content: <p>Система виявила незбережені дані {dayjs(draftStore.getDraftDate()).format("DD/MM/YYYY о HH:mm")}. Завантажити їх?</p>,
                okText: "Так",
                cancelText: "Видалити",
                
                onOk: () => {
                    isDraftModalVisible.current = false;
                    let data = draftStore.load();
                    if (!data) {
                        modal.error({
                            title: "Помилка",
                            content: <p>Не вдалось загрузити чорновик. Пошкоджені дані.</p>
                        });
                        return;
                    }
                    loadFromDraft(data);
                },
                onCancel: () => {
                    isDraftModalVisible.current = false;
                    draftStore.remove();
                }
            })
        }

        const beforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = true;
        }

        window.addEventListener("beforeunload", beforeUnload);
        window.addEventListener("unload", saveDraft);

        let intervalId = setInterval(() => {
            if (isDraftModalVisible.current) {
                return;
            }
            saveDraft();
        }, 60 * 1000);

        return () => {
            window.removeEventListener("beforeunload", beforeUnload);
            clearInterval(intervalId);
            modalInstance?.destroy();
        }
    }, [])

    return (
        <Foreground>
            <h1 style={{marginBottom: 15}}>Створити новий предмет</h1>

            <TeacherCreationForm
                teacherModalVisible={teacherModalVisible}
                setTeacherModalVisible={setTeacherModalVisible}
                mainForm={form}
            />

            <Form
                layout="vertical"
                form={form}
                onFinish={onSubmit}
                onValuesChange={({isExamRequired}) => {
                    if (typeof isExamRequired == 'boolean') {
                        setTestSelectorVisible(isExamRequired);
                    }
                }}
            >
                <Form.Item name="title" label="Назва предмету:" rules={[
                    { required: true, message: "Обов'язкове поле!" },
                    { min: 5, message: "Назва курсу повина мати більше ніж 4 символа." },
                    { max: 50, message: "Назва курсу не може мати більше аніж 50 символів." }
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Короткий опис предмету:" required>
                    <Form.Item noStyle name="short_desc" rules={[
                        { required: true, message: "Обов'язкове поле!" }
                    ]}>
                        <TextArea />
                    </Form.Item>
                    <i style={{color: "rgb(230,230,230)", fontSize: 16}}>Короткий опис буде видно на сторінці з усіма предметами.</i>
                </Form.Item>

                <Form.Item required label="Повний опис предмету:">
                    <p>Тут можна форматувати текст. Подробніше за посиланням <a href="/faq/text_formatting">тут.</a></p>
                    <Tiptap
                        ref={descRef}
                        style={{minHeight: 75}}
                        className="ant-input ant-input-outlined tiptap-text-area"
                        listsEnabled={true}
                        charsLimit={4000}
                        dontAddMath={true}
                    />
                </Form.Item>

                <Form.Item name="startDate" label="Початок предмету:" rules={[
                    { required: true, message: "Обов'язкове поле!" }
                ]}>
                    <DatePicker
                    />
                </Form.Item>

                <Form.Item required label="Приблизна тривалість предмету:">
                    <Form.Item initialValue={duration} noStyle name="duration">
                        <DatePicker.RangePicker
                            value={duration}
                            onChange={(val) => {
                                if (!val) {
                                    return;
                                }
                                setDuration(val);
                            }}
                        />
                    </Form.Item>
                    <span style={{marginLeft: 10}}>
                        {
                            (duration[0] && duration[1])
                            ? "(" + formatTimeInSeconds(differenceBetweenTwoDatesInSec(duration[0], duration[1])) + ")"
                            : ""
                        }
                    </span>
                </Form.Item>

                <Form.Item required name="timetable" label="Розклад заннять:" rules={[
                    { required: true, message: "Обов'язкове поле!" },
                ]}>
                    <Input placeholder="Наприклад: Заняття кожну середу" />
                </Form.Item>

                <TeacherSelector setTeacherModalVisible={setTeacherModalVisible} />

                <TagsSelector modal={modal} ref={tagsRef} />

                <Form.Item label="Вступний тест:">
                    <Form.Item noStyle name="isExamRequired">
                        <Switch />
                    </Form.Item>

                    {testSelectorVisible && <>
                            <Form.Item style={{marginTop: 20}} name="examEndDate" label="До якої дати можна буде здати екзамен:" rules={[
                                { required: true, message: "Обов'язкове поле!" }
                            ]}>
                                <DatePicker
                                />
                            </Form.Item>

                            <TestConstructor ref={testRef} />
                        </>}
                </Form.Item>

                <Form.Item>
                    <Button loading={isLoading} htmlType="submit" type="primary">Створити</Button>
                </Form.Item>
            </Form>

            {modalCtxHolder}
        </Foreground>
    );
}