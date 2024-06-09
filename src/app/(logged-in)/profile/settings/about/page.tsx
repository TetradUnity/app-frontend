'use client'

import {Avatar, Button, Input, Modal, UploadFile} from "antd"
import React, {useEffect, useState} from "react";
import {useProfileStore} from "@/stores/profileStore";
import Dragger from "antd/es/upload/Dragger";

import {CloudUploadOutlined, DeleteOutlined} from "@ant-design/icons";
import {UserService} from "@/services/user.service";
import TextArea from "antd/es/input/TextArea";
import ImgCropModal from "@/components/ImgCropModal";
import { UploadService, UploadType } from "@/services/upload.service";

export default function AccountSettingsPage() {
    const [modal, modalCtxHolder] = Modal.useModal();
    const profile = useProfileStore();

    const [originalFirstName, originalLastName, originalAvatar] = useProfileStore(state => [state.first_name, state.last_name, state.avatar]);
    const [firstName, setFirstName] = useState(originalFirstName);
    const [lastName, setLastName] = useState(originalLastName);

    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

    const [avatarURL, setAvatarURL] = useState(originalAvatar);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFirstName(originalFirstName);
        setLastName(originalLastName);
        setFileList([]);
        setAvatarURL(originalAvatar);
    }, [originalFirstName, originalLastName, originalAvatar]);

    const save = async () => {
        // if (!(fileList[0] && fileList[0].originFileObj)) {
        //     return;
        // }

        // UploadService.upload(UploadType.AVATAR, fileList[0].originFileObj).then(resp => {
        //     console.log(resp);
        // })

        const response = await UserService.editProfile({
            first_name: firstName,
            last_name: lastName,
            avatar: avatarURL
        });

        if (response.success) {
            modal.success({
                title: "Профіль успішно змінено",
                content: "Ваш профіль успішно змінено."
            });
        } else {
            modal.error({
                title: "Помилка зміни профілю",
                content: response.error_code
            });
        }
    }

    return (


        <div style={{
            padding: "12px 16px",
            background: 'var(--foreground)',
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--gap)"
            }}>
                <span>Аватар</span>
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "var(--gap-half)",
                    marginBottom: "var(--gap)"
                }}>
                    <ImgCropModal>
                        <Dragger
                            accept=".jpg,.jpeg,.png,.bmp"
                            fileList={fileList}
                            customRequest={
                                ({file, onSuccess}) => {
                                    // @ts-ignore
                                    onSuccess("ok");
                                }}
                            onChange={(info) => {
                                if (info.file.status === "uploading" || info.file.status === "done") {
                                    setFileList([info.file]);
                                    setAvatarURL(URL.createObjectURL(info.file.originFileObj as Blob));
                                } else {
                                    setFileList([]);
                                    setAvatarURL(originalAvatar);
                                }
                            }}
                            style={{
                                width: 128,
                                minHeight: 128,
                                maxHeight: 128,
                                borderRadius: 8,
                            }}>
                            <p>
                                <CloudUploadOutlined style={{color: "rgba(255,255,255,0.5)", fontSize: 24}}/>
                            </p>
                            <p style={{
                                fontSize: 13, color: "rgba(255,255,255,0.5)"
                            }}>Натисніть або перетягніть картинку</p>

                        </Dragger>
                    </ImgCropModal>
                    <div style={{
                        position: "relative",
                        width: 128,
                        height: 128,
                        borderRadius: 8,
                        overflow: "hidden"
                    }}>
                        <Avatar
                            size={128}
                            shape={"square"}
                            src={avatarURL}
                        ></Avatar>
                        <Button type="default" icon={<DeleteOutlined/>} onClick={() => {
                            setAvatarURL(originalAvatar);
                            setFileList([]);
                        }} style={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            background: "rgba(0,0,0,0.5)",
                            color: "white"
                        }}></Button>

                    </div>
                </div>
            </div>
            <div style={{
                display: "flex",
                gap: "var(--gap)",
                marginBottom: "var(--gap)"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--gap-half)",
                    width: "1000%"
                }}>
                    <span>Імя</span>
                    <Input value={firstName}
                           onChange={e => setFirstName(e.target.value)}
                    ></Input>
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--gap-half)",
                    width: "1000%"
                }}>
                    <span>Прізвище</span>
                    <Input value={lastName}
                           onChange={e => setLastName(e.target.value)}
                    ></Input>
                </div>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--gap-half)",
                marginBottom: "var(--gap)"
            }}>
                <span>Про себе</span>
                <TextArea rows={4} value={"NOT IMPLEMENTED"}></TextArea>
            </div>

            <Button type="primary" style={{marginLeft: "auto"}} onClick={save}>Зберегти</Button>
        </div>

    )
}