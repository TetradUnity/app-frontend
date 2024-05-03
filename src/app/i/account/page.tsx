'use client'

import { Button, Divider, Modal } from "antd"

import { deleteCookie } from "@/utils/Cookie";
import { useRouter } from "next/navigation";

export default function AccountPage() {
    const [modal, modalCtxHolder] = Modal.useModal();

    const {replace} = useRouter();

    const logout = () => {
        modal.confirm({
            title: "Вихід з облікового запису",
            content: "Ви впевнені в цьому?",
            okText: "Так",
            cancelText: "Ні.",
            onOk: () => {
                deleteCookie("AUTH_TOKEN");
                replace("/");
            }
        });
    };

    return (
        <div>
            <h1>Акаунт</h1>
            <p style={{marginBottom: 15}}>В цьому розділі можна робити дії повязані з акаунтом.</p>

            <Divider orientation="right" orientationMargin={0}>Вихід</Divider>

            <Button onClick={logout} style={{display: "block", marginLeft: "auto"}} type="primary" danger>Вийти з акаунту</Button>

            {modalCtxHolder}
        </div>
    )
}