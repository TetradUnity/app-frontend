'use client';

import { Button, Flex, Form, Input, message } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { CSSProperties, useState } from "react";

import { CertificateService } from "@/services/certificate.service";
import { UploadService, UploadType } from "@/services/upload.service";

const formStyle: CSSProperties = {
    width: 400,
    padding: 30,
    paddingBottom: 0,
    background: 'var(--foreground)',
    borderRadius: 10
}

export default function CheckCertificatePage() {
    const [isLoading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [signature, setSignature] = useState('');

    const onFormSubmitted = async () => {
        if (!signature) {
            return;
        }

        setLoading(true);

        const resp = await CertificateService.checkCertificate(signature);

        setLoading(false);

        if (!resp.success) {
            messageApi.error("Сертифікат недійсний");
            return;
        }

        messageApi.error("Сертифікат є дійсним!");
        window.open(UploadService.getImageURL(UploadType.CERTIFICATES, signature), '_blank')?.focus();
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
                    <h1 style={{textAlign: "center", marginBottom: 15, fontSize: 27}}>Перевірка сертифікату</h1>
                    <p style={{textAlign: "center", marginBottom: 30}}>У полі нижче вкажіть електроний підпис сертифіката, щоб дізнатися, чи є він справжнім.</p>

                    <Form.Item label="Підпис" name="signature" rules={[
                        { required: true, message: "Це поле є обов'язковим!" },
                    ]}>
                        <Input
                            value={signature}
                            onChange={(e) => setSignature(e.currentTarget.value)}
                        />
                    </Form.Item>

                    <Form.Item style={{marginTop: 40, marginBottom: 20}}>
                        <Button style={{margin: "auto", display: "block"}} loading={isLoading} type="primary" htmlType="submit">
                            Перевірити
                        </Button>
                    </Form.Item>
                </Form>
            </Flex>
            
            {contextHolder}
        </Content>
    );
}