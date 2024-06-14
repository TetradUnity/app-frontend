'use client'

import { Button, Flex, Form, Input, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { CSSProperties, useState } from "react";
import { AuthService } from "@/services/auth.service";
import translateRequestError from "@/utils/ErrorUtils";

const formStyle: CSSProperties = {
    width: 400,
    padding: 30,
    paddingBottom: 0,
    background: 'var(--foreground)',
    borderRadius: 10
}

export default function ForgotPasswordPage() {
    const [isLoading, setLoading] = useState(false);

    const [email, setEmail] = useState('');

    const [messageApi, contextHolder] = message.useMessage();

    const onFormSubmitted = async () => {
        setLoading(true);

        const resp = await AuthService.forgotPassword(email);

        setLoading(false);

        if (!resp.success) {
            messageApi.error("Сталася помилка: " + translateRequestError(resp.error_code));
            return;
        }
        
        messageApi.success("Найближчим часом вам надійде повідомлення на електронну пошту з інструкціями щодо скидання паролю.");
        setEmail('');
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
                    <h1 style={{textAlign: "center", marginBottom: 15}}>Скидання паролю</h1>
                    <p style={{textAlign: "center", marginBottom: 30}}>На вашу електронну пошту надійде повідомлення з інструкціями щодо скидання паролю.</p>

                    <Form.Item label="Email" name="email" rules={[
                        { required: true, message: "Це поле є обов'язковим!" },
                    ]}>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.currentTarget.value)}
                        />
                    </Form.Item>

                    <Form.Item style={{marginTop: 40, marginBottom: 10}} wrapperCol={{ offset: 7, span: 30 }}>
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Продовжити
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
            {contextHolder}
        </Content>
    );
}