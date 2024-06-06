'use client'

import Foreground from "@/components/Foreground";
import Tiptap from "@/components/Tiptap";
import { TestConstructor, TestConstructorRef } from "@/components/tests/TestConstructor";
import { ChiefTeacherService } from "@/services/chief_teacher.service";
import { useProfileStore } from "@/stores/profileStore";
import { CreateSubjectParams } from "@/types/api.types";
import { differenceBetweenTwoDatesInSec, formatTimeInSeconds } from "@/utils/TimeUtils";
import { AutoComplete, Button, DatePicker, Form, GetRef, Input, Modal, Select, Switch, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import debounce from 'lodash/debounce';

const TeacherSelector = function({setTeacherModalVisible} : any) {
    const [options, setOptions] = useState<{value: string}[]>([]);

    const search = async (text: string) => {
        if (text.length < 2) {
            return [];
        }
        
        const response = await ChiefTeacherService.findTeacherByEmail(text);

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
                    <>
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

const TeacherCreationForm = ({teacherModalVisible, setTeacherModalVisible} : any) => {
    const role = useProfileStore(useShallow(selector => selector.role));
    const { replace } = useRouter();
    if (role != "CHIEF_TEACHER") {
        replace("/home");
        return null;
    }

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
                api.error("Трапилась помилка: " + res.error_code);
                return;
            }

            api.success("Успішно!");
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

export default function CreateSubjectPage() {
    const [form] = Form.useForm();
    const [modal, modalCtxHolder] = Modal.useModal();

    const [teacherModalVisible, setTeacherModalVisible] = useState(false);
    const [testSelectorVisible, setTestSelectorVisible] = useState(false);

    const [duration, setDuration] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([dayjs(), dayjs().add(1, 'month')]);

    const testRef = useRef<TestConstructorRef>();

    const [isLoading, setLoading] = useState(false);

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
                let exam = null;
                if (testRef.current) {
                    exam = testRef.current.getData();
                    if (exam == null) {
                        return;
                    }
                    exam = JSON.stringify(exam);
                }

                let start_subject = form.getFieldValue("startDate").unix() * 1000;
                let end_exam = form.getFieldValue("examEndDate").unix() * 1000;

                if (end_exam && (end_exam > start_subject)) {
                    err("Дата закінчення екзамену не може бути назначеною після того як почнеться предмет.");
                    return;
                }

                let info: CreateSubjectParams = {
                    title: form.getFieldValue("title"),
                    description: form.getFieldValue("desc"),
                    short_description: form.getFieldValue("short_desc"),
                    start: start_subject,
                    exam_end: end_exam,
                    duration: differenceBetweenTwoDatesInSec(duration[0], duration[1]),
                    timetable: form.getFieldValue("timetable"),
                    tags: [],
                    exam: exam,
                    teacherEmail: form.getFieldValue("teacher")
                }
                
                setLoading(true);

                ChiefTeacherService.createSubject(info).then(resp => {
                    setLoading(false);
                    if (!resp.success) {
                        err("Не вдалось створити предмет: " + resp.error_code);
                        return;
                    }

                    modal.success({
                        title: "Успіх!",
                        maskClosable: true,
                        content: "Тільки що ви створили новий предмет."
                    })
                })
            }
        })
    }

    return (
        <Foreground>
            <h1 style={{marginBottom: 15}}>Створити новий предмет</h1>

            <TeacherCreationForm
                teacherModalVisible={teacherModalVisible}
                setTeacherModalVisible={setTeacherModalVisible}
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