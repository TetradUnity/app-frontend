'use client'

import { Button, Flex, Form, Input, Modal, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { CSSProperties, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import translateRequestError from "@/utils/ErrorUtils";

const formStyle: CSSProperties = {
    width: 450,
    padding: 30,
    paddingBottom: 0,
    background: 'var(--foreground)',
    borderRadius: 10
}

export default function RecoveryPasswordPage() {
    const { slug } = useParams();

    const [isLoading, setLoading] = useState(false);
    const [password, setPassword] = useState('');

    const [messageApi, contextHolder] = message.useMessage();
    const [modal, modalCtx] = Modal.useModal();

    const { push } = useRouter();

    const onFormSubmitted = async () => {
        setLoading(true);

        const resp = await AuthService.recoveryPassword(slug as string, password);

        setLoading(false);

        if (!resp.success) {
            messageApi.error("Сталася помилка: " + translateRequestError(resp.error_code));
            return;
        }
        
        modal.success({
            title: "Успіх!",
            content: <p>Тепер ви можете увійти з новим паролем.</p>,
            maskClosable: false,
            onOk: () => {
                push("/login");
            }
        });
    }

    return (
        <Content>
            <Flex style={{padding: 20}} justify="center" align="center">
                <Form
                    variant="filled"
                    labelCol={{span: 9}}
                    wrapperCol={{span: 30}}
                    autoComplete="off"
                    onFinish={onFormSubmitted}
                    style={{ ...formStyle }}
                >
                    <h1 style={{textAlign: "center", marginBottom: 15}}>Скидання паролю</h1>

                    <Form.Item label="Новий пароль:" name="password" rules={[
                        { required: true, message: "Це поле є обов'язковим!" },
                    ]}>
                        <Input
                            value={password}
                            type="password"
                            onChange={(e) => setPassword(e.currentTarget.value)}
                        />
                    </Form.Item>

                    <Form.Item style={{marginTop: 40, marginBottom: 10}} wrapperCol={{ offset: 9, span: 30 }}>
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Скинути
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
            {modalCtx}
            {contextHolder}
        </Content>
    );
}