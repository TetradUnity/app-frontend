'use client'
import {Avatar, Button, Empty, message} from "antd";
import {ContainerOutlined, SettingOutlined, UserOutlined, EyeOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useEffect, useState} from "react";
import styles from "./styles.module.css";
import {useProfileStore} from "@/stores/profileStore";
import {useQueryProfileStore} from "@/stores/queryProfileStore";
import {CertificateService} from "@/services/certificate.service";
import {ICertificate} from "@/types/api.types";
import { UploadService, UploadType } from "@/services/upload.service";
import { translateCertificatyType } from "@/utils/InternalizationUtils";

function localizeRole(role: string) {
    switch (role) {
        case "STUDENT":
            return "Студент";
        case "TEACHER":
            return "Викладач";
        case "CHIEF_TEACHER":
            return "Головний вчитель";
        default:
            return role;
    }
}

export default function ProfileHead() {
    const myRole = useProfileStore(store => store.role);
    const profile = useQueryProfileStore();

    const [certificatesVisible, setCertificatesVisible] = useState(false);
    const [certificates, setCertificates] = useState<ICertificate[]>([]);

    const [msg, msgCtx] = message.useMessage();

    const [messageApi, contextHolder] = message.useMessage();

    const fetchCertificates = () => {
        CertificateService.getCertificates(profile.id).then(response => {
            if (response.success) {
                setCertificates(response.data!);
            } else {
                messageApi.error("Помилка завантаження сертифікатів");
            }
        })
    }

    const toggleCertificates = () => {
        if (!certificatesVisible) {
            fetchCertificates();
        }
        setCertificatesVisible(!certificatesVisible);
    }

    useEffect(() => {
        document.title = `Профіль / ${profile.first_name} ${profile.last_name}`
    }, []);

    return (
        <>
            <div className={styles.container}>
                <div className={styles.info}>
                    <Avatar src={profile.avatar_url} shape="square" alt='avatar' size={128} icon={<UserOutlined/>}/>
                    <div>
                        <strong style={{fontSize: 24}}>{profile.first_name + " " + profile.last_name}</strong>
                        <p style={{color: 'var(--text-secondary)'}}>{localizeRole(profile.role)}</p>
                        {myRole === "TEACHER" || myRole === "CHIEF_TEACHER" || profile.isMe ?
                            <p style={{color: 'var(--text-secondary)'}}>{profile.email}</p> : null}
                    </div>
                </div>
                <div className={styles.buttons}>
                    {profile.isMe &&
                        <Link href="/profile/settings">
                            <Button type="text" icon={<SettingOutlined/>} style={{
                                padding: "0 8px",
                                display: "flex",
                                alignItems: "center"
                            }}>Налаштування</Button>
                        </Link>
                    }
                    {profile.role === 'STUDENT' &&
                        < Button type="text" icon={<ContainerOutlined/>} onClick={toggleCertificates} style={{
                        padding: "0 8px",
                        display: "flex",
                        alignItems: "center"
                    }}>Сертифікати</Button>}
                </div>
            </div>
            {certificatesVisible &&
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: '12px 16px',
                    borderRadius: 8,
                    backgroundColor: "var(--foreground)",
                    justifyContent: "center",
                    gap: 'var(--gap)',

                }}>
                    <h3>Сертифікати</h3>
                    {certificates.length > 0 ? certificates.map((certificate: ICertificate, i) => (
                        <div key={i} style={{
                            display: "flex",
                            gap: 'var(--gap)',
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%"
                        }}>
                            <div>
                                <strong style={{fontSize: 23}}>{certificate.title}</strong>
                                <p>{translateCertificatyType(certificate.type)}</p>
                            </div>

                            <Button
                                icon={<EyeOutlined />}
                                type="dashed"
                                shape="circle"
                                onClick={() => window.open(UploadService.getImageURL(UploadType.CERTIFICATES, certificate.uid), "_blank")?.focus()}
                            />
                        </div>
                    )) : <Empty description="Сертифікати відсутні"/>}
                </div>}
            {msgCtx}
        </>
    );
}