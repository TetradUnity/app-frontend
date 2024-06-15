'use client'

import {Button, Form, Input, message} from "antd";
import React, {useEffect, useState} from "react";
import {useProfileStore} from "@/stores/profileStore";
import Link from "next/link";
import {UserService} from "@/services/user.service";

export default function SecuritySettings() {
    const profile = useProfileStore();

    const [messageApi, contextHolder] = message.useMessage();

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const [newEmail, setNewEmail] = useState(profile.email);

    useEffect(() => {
        document.title = "Безпека / Налаштування";
    }, []);


    const savePassword = async () => {
        if (!password || !newPassword || !passwordRepeat) {
            messageApi.error('Заповніть всі поля');
            return;
        }
        if (password === newPassword) {
            messageApi.error('Новий пароль не може співпадати зі старим');
            return;
        }
        if (newPassword !== passwordRepeat) {
            messageApi.error('Паролі не співпадають');
            return;
        }
        try {
            const response = await UserService.editProfile({
                oldPassword: password,
                password: newPassword
            });
            if (response.success) {
                messageApi.success('Пароль успішно змінено');
            } else {
                messageApi.error('Помилка зміни пароля');
            }
        } catch (e) {
            messageApi.error('Невідома помилка');
        }
    }

    const saveEmail = async () => {
        if (!newEmail) {
            messageApi.error('Заповніть поле почти');
            return;
        }
        if (newEmail === profile.email) {
            messageApi.error('Нова почта не може співпадати зі старою');
            return;
        }
        try {
            const response = await UserService.editProfile({
                email: newEmail
            });
            if (response.success) {
                messageApi.success('Почта успішно змінена');
            } else {
                messageApi.error('Помилка зміни почти');
            }
        } catch (e) {
            messageApi.error('Невідома помилка');
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--gap)",
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--gap)",
                padding: "12px 16px",
                background: 'var(--foreground)',
                borderRadius: 8,
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                width: "100%"
            }}>
                <span>Зміна паролю</span>
                <Form layout="vertical" onFinish={savePassword}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gridTemplateRows: "auto auto",
                        alignItems: "flex-end",
                        gap: "var(--gap-half)",
                        marginBottom: "var(--gap)",
                        width: "100%"
                    }}>
                        <Form.Item label="Старий пароль">
                            <Input.Password onChange={e => setPassword(e.target.value)}/>
                        </Form.Item>
                        <div/>
                        <Form.Item label="Новий пароль">
                            <Input.Password onChange={e => setNewPassword(e.target.value)}/>
                        </Form.Item>
                        <Form.Item label="Повторіть новий пароль">
                            <Input.Password onChange={e => setPasswordRepeat(e.target.value)}/>
                        </Form.Item>

                    </div>
                    <div style={{
                        background: "#7799DD33",
                        color: "#77AADD",
                        borderRadius: 8,
                        padding: "12px 16px",
                        marginBottom: "var(--gap)"
                    }}>
                        <div>
                            Якщо не пам'ятаєте пароль, можете скористуватися <Link href="/forgot-password" style={{
                            color: "#87BAFF",
                            textDecoration: "underline"
                        }}>скиданням
                            пароля</Link>.
                        </div>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Змінити пароль</Button>
                    </Form.Item>
                </Form>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--gap)",
                padding: "12px 16px",
                background: 'var(--foreground)',
                borderRadius: 8,
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                width: "100%"
            }}>
                <span>Зміна електронної почти</span>
                <Form layout="vertical" onFinish={saveEmail}>
                    <Form.Item label="Нова електронна почта">
                        <Input value={newEmail} onChange={
                            e => setNewEmail(e.target.value)
                        }/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Змінити почту</Button>
                    </Form.Item>
                </Form>
            </div>

            {contextHolder}
        </div>
    )
}