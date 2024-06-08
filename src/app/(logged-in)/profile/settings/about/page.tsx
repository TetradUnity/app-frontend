'use client'

import {Avatar, Button, Input, Modal} from "antd"
import React, {useState} from "react";
import {useProfileStore} from "@/stores/profileStore";
import Dragger from "antd/es/upload/Dragger";
import {UploadProps} from "antd/lib";

import {CloudUploadOutlined, DeleteOutlined} from "@ant-design/icons";
import {UserService} from "@/services/user.service";
import TextArea from "antd/es/input/TextArea";

const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: '/api/upload', //TODO upload avatar
    onChange(info) {
        //   const { status } = info.file;
        //   if (status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        //   }
        //   if (status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully.`);
        //   } else if (status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        //   }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};
export default function AccountSettingsPage() {
    const [modal, modalCtxHolder] = Modal.useModal();
    const profile = useProfileStore();
    const [newProfile, setNewProfile] = useState(profile);

    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [editPasswordVisible, setEditPasswordVisible] = useState(false);

    const save = async () => {
        const response = await UserService.editProfile({
            first_name: newProfile.first_name as string,
            last_name: newProfile.last_name as string,
            avatar: newProfile.avatar
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
                    <Dragger style={{
                        width: 128,
                        minHeight: 128,
                        maxHeight: 128,
                        borderRadius: 8,
                    }} {...props}>
                        <p>
                            <CloudUploadOutlined style={{color: "rgba(255,255,255,0.5)", fontSize: 24}}/>
                        </p>
                        <p style={{
                            fontSize: 13, color: "rgba(255,255,255,0.5)"
                        }}>Натисніть або перетягніть картинку</p>

                    </Dragger>
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
                            src={profile.avatar ? profile.avatar : "https://media.licdn.com/dms/image/C5603AQE-LZbyqja3GQ/profile-displayphoto-shrink_800_800/0/1585481402347?e=2147483647&v=beta&t=0jx6LRb9wlnWNVNSWzmXAVnDWwvFGVO_klpqm94TynY"}
                        ></Avatar>
                        <Button type="default" icon={<DeleteOutlined/>} onClick={() => {
                            newProfile.avatar = "";
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
                    <Input value={newProfile.first_name}
                           onChange={e => setNewProfile({...newProfile, first_name: e.target.value})}
                    ></Input>
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--gap-half)",
                    width: "1000%"
                }}>
                    <span>Прізвище</span>
                    <Input value={newProfile.last_name}
                           onChange={e => setNewProfile({...newProfile, last_name: e.target.value})}
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