'use client'

import { Button, Flex, Form, Input, message, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { CSSProperties, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthTokensService } from "@/services/auth-token.service";
import { AuthService } from "@/services/auth.service";

const formStyle: CSSProperties = {
    width: 400,
    padding: 30,
    paddingBottom: 0,
    background: "#1f1f1f",
    borderRadius: 10
}

export default function LoginPage() {
    const [isLoading, setLoading] = useState(false);
    const {replace} = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [messageApi, contextHolder] = message.useMessage();

    const onFormSubmitted = async () => {
        setLoading(true);

        const resp = await AuthService.login(email, password);

        setLoading(false);

        if (!resp.success) {
            messageApi.error("Не вдалося авторизуватися: " + resp.error_code);
            return;
        }
        
        replace("/home");
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
                <Input
                    value={password}
                    onChange={(e) => setPassword(e.currentTarget.value)}
                    type="password"
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
