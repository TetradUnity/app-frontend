'use client'

import Foreground from "@/components/Foreground";
import { TestConstructor, TestConstructorRef } from "@/components/tests/TestConstructor";
import { ChiefTeacherService } from "@/services/chief_teacher.service";
import { CreateSubjectParams } from "@/types/api.types";
import { differenceBetweenTwoDatesInSec, formatTimeInSeconds } from "@/utils/TimeUtils";
import { AutoComplete, Button, DatePicker, Form, GetRef, Input, Modal, Select, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { useRef, useState } from "react";

const mock_teachers = [{
    email: "teacher@gmail.com"
}];

const mock_search_teache_by_email = function(search: string) {
    let result = [];

    let teacher;
    for (let i = 0; i < mock_teachers.length; i++) {
        teacher = mock_teachers[i];
        if (teacher.email.startsWith(search)) {
            result.push(teacher.email);
        }
    }

    return result;
}

const TeacherSelector = function({setTeacherModalVisible} : any) {
    const [options, setOptions] = useState<{value: string}[]>([]);

    const search = (text: string) => {
        if (!text) {
            return [];
        }

        return mock_search_teache_by_email(text).map(email => ({
            value: email
        }));
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
                onSearch={(text) => setOptions(search(text))}
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

    const onOk = () => {
        setTeacherModalVisible(false);
    }

    return (
        <Modal
            title="Створити вчителя"
            closable={false}
            okText="Створити"
            cancelText="Скасувати"
            open={teacherModalVisible}
            onOk={onOk}
            onCancel={() => setTeacherModalVisible(false)}
            maskClosable={false}
            zIndex={1000}
        >
            <Form 
                layout="vertical"
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

                <Form.Item label="Пароль:">
                    <Form.Item name="password" rules={[
                        { required: true, message: "Обов'язкове поле!" },
                    ]} noStyle>
                        <Input />
                    </Form.Item>
                    <p>Вчитель зможе змінити свій пароль в будь який час.</p>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default function CreateSubjectPage() {
    const [form] = Form.useForm();

    const [teacherModalVisible, setTeacherModalVisible] = useState(false);

    const [testSelectorVisible, setTestSelectorVisibkle] = useState(false);

    const [duration, setDuration] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([dayjs(), dayjs().add(1, 'month')]);

    const testRef = useRef<TestConstructorRef>();

    const [isLoading, setLoading] = useState(false);

    const [modal, modalCtxHolder] = Modal.useModal();

    const err = (err: string) => {
        modal.error({
            title: "Помилка.",
            maskClosable: true,
            content: err
        })
    }

    const onSubmit = () => {
        if (isLoading) return;

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

        if (end_exam > start_subject) {
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
            timetable: "поки що нічого :)",
            tags: [],
            exam: exam,
            teacherEmail: form.getFieldValue("teacher")
        }

        alert(JSON.stringify(info));
        setLoading(true);
        ChiefTeacherService.createSubject(info).then(resp => {
            setLoading(false);
            if (!resp.success) {
                err("Failed ?");
                return;
            }
            err("Успіх!")
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
                        setTestSelectorVisibkle(isExamRequired);
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

                <Form.Item name="desc" label="Повний опис предмету:" rules={[
                    { required: true, message: "Обов'язкове поле!" }
                ]}>
                    <TextArea />
                </Form.Item>

                <Form.Item name="startDate" label="Початок предмету:" rules={[
                    { required: true, message: "Обов'язкове поле!" }
                ]}>
                    <DatePicker
                    />
                </Form.Item>

                <Form.Item name="examEndDate" label="До якої дати можна буде здати екзамен:" rules={[
                        { required: true, message: "Обов'язкове поле!" }
                ]}>
                    <DatePicker
                    />
                </Form.Item>

                <Form.Item label="Приблизна тривалість предмету:">
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

                <TeacherSelector setTeacherModalVisible={setTeacherModalVisible} />

                <Form.Item label="Вступний тест:">
                    <Form.Item noStyle name="isExamRequired">
                        <Switch />
                    </Form.Item>

                    {testSelectorVisible && <TestConstructor ref={testRef} />}
                </Form.Item>

                <Form.Item>
                    <Button loading={isLoading} htmlType="submit" type="primary">Створити</Button>
                </Form.Item>
            </Form>

            {modalCtxHolder}
        </Foreground>
    );
}