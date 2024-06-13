'use client'

import { Button, Flex, Form, Input, message, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import {CSSProperties, useEffect, useState} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthTokensService } from "@/services/auth-token.service";
import { AuthService } from "@/services/auth.service";

const formStyle: CSSProperties = {
    width: 400,
    padding: 30,
    paddingBottom: 0,
    background: 'var(--foreground)',
    borderRadius: 10
}

export default function LoginPage() {
    const [isLoading, setLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        document.title = "Вхід в акаунт";
    }, []);

    const onFormSubmitted = async () => {
        setLoading(true);

        const resp = await AuthService.login(email, password);

        setLoading(false);

        if (!resp.success) {
            let errToDisplay;

            switch(resp.error_code) {
                case "user_not_found":
                    errToDisplay = "Користувача з таким email не було знайдено.";
                    break;
                case "incorrect_password":
                    errToDisplay = "Невірний пароль.";
                    break;
                default:
                    errToDisplay = "Трапилась невідома помилка. Спробуйте ще раз!";
                    break;
            }

            messageApi.error(errToDisplay);
            return;
        }
        
        window.location.href = "/home";
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
            <h1 style={{textAlign: "center", marginBottom: 30}}>Увійти в акаунт</h1>

            <Form.Item label="Email" name="email" rules={[
                { required: true, message: "Обов'язкове поле!" },
            ]}>
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                 />
            </Form.Item>

            <Form.Item label="Пароль" name="password" rules={[
                { required: true, message: "Обов'язкове поле!" },
            ]}>
                <Input.Password
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                 />
            </Form.Item>

            <Form.Item style={{marginTop: 40, marginBottom: 10}} wrapperCol={{ offset: 7, span: 30 }}>
                <Button loading={isLoading} type="primary" htmlType="submit">
                    Продовжити
                </Button>
            </Form.Item>

            <p style={{marginBottom: 20}}>
                Немає ще акаунту? Можете створити його <Link href="/register">тут</Link>.
            </p>
        </Form>
      </Flex>
      {contextHolder}
    </Content>
  );
}
