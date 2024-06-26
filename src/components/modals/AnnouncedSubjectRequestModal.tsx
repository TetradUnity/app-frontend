import { validateEmail } from "@/utils/OtherUtils";
import { Input, Modal, Segmented, message } from "antd";
import React, { CSSProperties, useImperativeHandle, useState } from "react";

const sectionStyle: CSSProperties = {
    marginTop: 10
}

export type AnnouncedSubjectRequestModalRef = {
    set: (email: string, firstName?: string, lastName?: string) => void
}

const AnnouncedSubjectRequestModal = React.forwardRef(function AnnouncedSubjectRequestModal(
    {isOpen, close, callback}
    :
    {isOpen: boolean, close: () => void, callback: (email: string, first_name?: string, last_name?: string) => void}
, ref) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    type chooseType = "registered" | "not_registered";
    const [choose, setChoose] = useState<chooseType>("not_registered");
    
    const [messageApi, contextHolder] = message.useMessage();

    useImperativeHandle(ref, () => ({
        set: (email: string, firstName?: string, lastName?: string) => {
            setEmail(email);
            setFirstName(firstName || '');
            setLastName(lastName || '');
        }
    }) as AnnouncedSubjectRequestModalRef);

    const onOk = () => {
        let data = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim()
        };

        if (choose == "not_registered") {
            if (!(data.firstName && data.lastName)) {
                messageApi.error("Введіть коректні дані.");
                return;
            }
        }

        if (!validateEmail(data.email)) {
            messageApi.error("Введіть правильний email!");
            return;
        }

        callback(email, firstName, lastName)
        close();
        setFirstName(''); setLastName(''); setEmail('');
    }

    return (
        <Modal
            title="Заявка на вхід до предмета"
            open={isOpen}
            okText="Подати заявку"
            onOk={onOk}
            onCancel={close}
        >
            <Segmented
                value={choose}
                onChange={(choose: chooseType) => setChoose(choose)}
                block
                options={[
                    {label: "Я не маю облікового запису", value: "not_registered"},
                    {label: "Я маю обліковий запис", value: "registered"}
                ]}
            />

            {choose == "not_registered" &&
                <>
                    <section style={sectionStyle}>
                        <h4>Ім&apos;я:</h4>
                        <Input
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            name="firstName"
                        />
                    </section>

                    <section style={sectionStyle}>
                        <h4>Фамілія:</h4>
                        <Input
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            name="lastName"
                        />
                    </section>
                </>
            }

            <section style={sectionStyle}>
                <h4>Email:</h4>
                <Input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    name="email"
                />
            </section>

            {contextHolder}
        </Modal>
    )
});


export default AnnouncedSubjectRequestModal;