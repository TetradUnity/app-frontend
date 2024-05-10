'use client'

import { AuthTokensService } from "@/services/auth-token.service";
import { Button, Divider, Modal } from "antd"

import { useRouter } from "next/navigation";

export default function AccountSettingsPage() {
    const [modal, modalCtxHolder] = Modal.useModal();

    const {replace} = useRouter();

    const logout = () => {
        modal.confirm({
            title: "Вихід з облікового запису",
            content: "Ви впевнені в цьому?",
            okText: "Так",
            cancelText: "Ні.",
            onOk: () => {
                AuthTokensService.deleteAuthToken();
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