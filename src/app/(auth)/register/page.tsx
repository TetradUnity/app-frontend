'use client'

import { Button, Flex, Form, Input, Select, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { CSSProperties, useState } from "react";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";

const formStyle: CSSProperties = {
    width: 400,
    padding: 30,
    paddingBottom: 0,
    background: 'var(--foreground)',
    borderRadius: 10
}

export default function RegisterPage() {
    
    const [isLoading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState("student");
    const [password, setPassword] = useState('');

    const onFormSubmitted = async () => {
        setLoading(true);

        const resp = await AuthService.register(email, firstName, lastName, password, role);

        setLoading(false);

        if (!resp.success) {
            let errToDisplay;

            switch(resp.error_code) {
                case "user_already_exist":
                    errToDisplay = "Користувач з таким email вже існує в системі.";
                    break;
                default:
                    errToDisplay = "Трапилась невідома помилка. Спробуйте ще раз!";
                    break;
            }

            messageApi.error(errToDisplay);
            return;
        }
        
        messageApi.success("Успішно! Тепер потрібно авторизуватися.");
    }

  return (
    <Content>
      <Flex style={{padding: 20}} justify="center" align="center">
        <Form
            variant="filled"
            labelCol={{span: 7}}
            wrapperCol={{span: 30}}
            autoComplete="off"
            onFinish={onFormSubmitted}
            style={{ ...formStyle }}
        >
            <h1 style={{textAlign: "center", marginBottom: 30}}>Створити акаунт</h1>

            <Form.Item label="Email" name="email" rules={[
                { required: true, message: "Обов'язкове поле!" },
                { min: 5, message: "Email повинен мати як мінімум 5 символів." },
                { max: 50, message: "Email не може мати більше аніж 50 символів." },
            ]}>
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                 />
            </Form.Item>


            <Form.Item label="Імя" name="firstName" rules={[
                { required: true, message: "Обов'язкове поле!" }
            ]}>
                <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.currentTarget.value)}
                 />
            </Form.Item>

            <Form.Item label="Фамілія" name="lastName" rules={[
                { required: true, message: "Обов'язкове поле!" }
            ]}>
                <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.currentTarget.value)}
                 />
            </Form.Item>

            <Form.Item label="Пароль" name="password" rules={[
                { required: true, message: "Обов'язкове поле!" },
                { min: 5, message: "Пароль повинен мати як мінімум 5 символів." },
                { max: 50, message: "Пароль не може мати більше аніж 50 символів." },
            ]}>
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    type="password"
                />
            </Form.Item>

            <Form.Item initialValue={role} label="Роль" name="role" required={true}>
                <Select
                    onChange={(role) => setRole(role)}
                    options={[
                        { value: 'student', label: "Студент" },
                        { value: 'teacher', label: "Вчитель" },
                        { value: 'chief_teacher', label: "Головний вчитель" },
                    ]}
                />
            </Form.Item>

            <Form.Item style={{marginTop: 40, marginBottom: 10}} wrapperCol={{ offset: 7, span: 30 }}>
                <Button loading={isLoading} type="primary" htmlType="submit">
                    Продовжити
                </Button>
            </Form.Item>

            <p style={{marginBottom: 20}}>
                Вже є акаунт? Можете увійти в нього <Link href="/login">тут</Link>.
            </p>
        </Form>
      </Flex>

      {contextHolder}
    </Content>
  );
}
