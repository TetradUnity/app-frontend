'use client'

import { Button, Flex, Form, Input, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { CSSProperties, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "@/utils/Cookie";

const formStyle: CSSProperties = {
    width: 400,
    padding: 30,
    paddingBottom: 0
}

export default function() {
    const {
        token: { colorBgElevated, borderRadiusLG },
    } = theme.useToken();

    const [isLoading, setLoading] = useState(false);
    const {replace} = useRouter();

    const onFormSubmitted = () => {
        setLoading(true);
        setTimeout(() => {
            setCookie("AUTH_TOKEN", "dfjhvbfhdvbhfdhbvj", 365);
            replace("/i/home");
        }, 1000);
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
            style={{ ...formStyle, background: colorBgElevated, borderRadius: borderRadiusLG }}
        >
            <h1 style={{textAlign: "center", marginBottom: 30}}>Увійти в акаунт</h1>

            <Form.Item label="Email" name="email" rules={[
                { required: true, message: "Обов'язкове поле!" },
                { min: 5, message: "Email повинен мати як мінімум 5 символів." },
                { max: 50, message: "Email не може мати більше аніж 50 символів." },
            ]}>
                <Input />
            </Form.Item>

            <Form.Item label="Пароль" name="password" rules={[
                { required: true, message: "Обов'язкове поле!" },
                { min: 5, message: "Пароль повинен мати як мінімум 5 символів." },
                { max: 50, message: "Пароль не може мати більше аніж 50 символів." },
            ]}>
                <Input type="password" />
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
    </Content>
  );
}
