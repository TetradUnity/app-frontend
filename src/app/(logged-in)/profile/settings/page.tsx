'use client'

import { AuthTokensService } from "@/services/auth-token.service";
import { Avatar, Button, Divider, Input, Modal } from "antd"

import { useRouter } from "next/navigation";

import styles from "./styles.module.css";
import { useState } from "react";
import { useProfileStore } from "@/stores/profileStore";
import Dragger from "antd/es/upload/Dragger";
import { UploadProps } from "antd/lib";

import {InboxOutlined} from "@ant-design/icons";
import Foreground from "@/components/Foreground";

const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
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

const ProfileChangeModal = ({editProfileVisible, setEditProfileVisible} : {editProfileVisible: boolean, setEditProfileVisible: (v: boolean) => void}) => {
    const [originalFirstName, originalLastName] = useProfileStore(state => [state.first_name, state.last_name]);

    const [firstName, setFirstName] = useState(originalFirstName);
    const [lastName, setLastName] = useState(originalLastName);

    const onOk = () => {
        setEditProfileVisible(false);
    }

    return (

        <Modal
            title="Редагування профілю"
            closable={false}
            okText="Змінити"
            cancelText="Скасувати"
            open={editProfileVisible}
            onOk={onOk}
            onCancel={() => setEditProfileVisible(false)}
            maskClosable={false}
            className={styles.modal}
        >
            <button className={styles.modal_avatar_btn}>
                <img className={styles.modal_avatar} src={"https://media.licdn.com/dms/image/C5603AQE-LZbyqja3GQ/profile-displayphoto-shrink_800_800/0/1585481402347?e=2147483647&v=beta&t=0jx6LRb9wlnWNVNSWzmXAVnDWwvFGVO_klpqm94TynY"} alt="avatar" />
            </button>

            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                <InboxOutlined style={{color: "white"}} />
                </p>
                <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
                <p className="ant-upload-hint">
                    Суворо заборонено завантажувати дані компанії чи інші заборонені файли.
                </p>
            </Dragger>

            <section className={styles.modal_section}>
                <h3>Ім'я:</h3>
                <Input
                    value={firstName}
                    placeholder={originalFirstName}
                    onChange={e => setFirstName(e.target.value)}
                />
            </section>

            <section className={styles.modal_section}>
                <h3>Фамілія:</h3>
                <Input
                    value={lastName}
                    placeholder={originalLastName}
                    onChange={e => setLastName(e.target.value)}
                />
            </section>
        </Modal>
    )
}

const PasswordChangeModal = ({editPasswordVisible, setEditPasswordVisible} : {editPasswordVisible: boolean, setEditPasswordVisible: (v: boolean) => void}) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmedNewPassword] = useState("");

    const onOk = () => {
        setEditPasswordVisible(false);
    }

    return (
        <Modal
            title="Зміна паролю"
            closable={false}
            okText="Змінити"
            cancelText="Скасувати"
            open={editPasswordVisible}
            onOk={onOk}
            onCancel={() => setEditPasswordVisible(false)}
            maskClosable={false}
            className={styles.modal}
        >
            <section className={styles.modal_section}>
                <h4>Старий пароль:</h4>
                <Input
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    type="password"
                />
            </section>

            <section className={styles.modal_section}>
                <h4>Новий пароль:</h4>
                <Input
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    type="password"
                />
            </section>

            <section className={styles.modal_section}>
                <h4>Підтвердіть новий пароль:</h4>
                <Input
                    value={confirmNewPassword}
                    onChange={e => setConfirmedNewPassword(e.target.value)}
                    type="password"
                />
            </section>
        </Modal>
    )
}

export default function AccountSettingsPage() {
    const [modal, modalCtxHolder] = Modal.useModal();
    const profile = useProfileStore();

    const [editProfileVisible, setEditProfileVisible] = useState(false);
    const [editPasswordVisible, setEditPasswordVisible] = useState(false);

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
        <Foreground>
            <h1>Налаштування</h1>

            <Divider orientation="right" orientationMargin={0}>Профіль</Divider>

            <div className={styles.setting_div}>
                <p>Імя: <i>{profile.first_name}</i></p>
                <Button onClick={() => setEditProfileVisible(true)}>Змінити</Button>
            </div>
            <div className={styles.setting_div}>
                <p>Фамілія: <i>{profile.last_name}</i></p>
                <Button onClick={() => setEditProfileVisible(true)}>Змінити</Button>
            </div>
            <div className={styles.setting_div}>
                <p>Аватар</p>
                <Button onClick={() => setEditProfileVisible(true)}>Змінити</Button>
            </div>



            <Divider orientation="right" orientationMargin={0}>Обліковий запис</Divider>

            <div className={styles.setting_div}>
                <p>Пароль</p>
                <Button onClick={() => setEditPasswordVisible(true)}>Змінити</Button>
            </div>


            <Divider orientation="right" orientationMargin={0}>Вихід</Divider>
            <Button onClick={logout} style={{display: "block", marginLeft: "auto"}} type="primary" danger>Вийти з акаунту</Button>

            {modalCtxHolder}
            <ProfileChangeModal
                editProfileVisible={editProfileVisible}
                setEditProfileVisible={setEditProfileVisible}
            />
            <PasswordChangeModal
                editPasswordVisible={editPasswordVisible}
                setEditPasswordVisible={setEditPasswordVisible}
            />
        </Foreground>
    )
}