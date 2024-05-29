import { validateEmail } from "@/utils/OtherUtils";
import { Input, Modal, Segmented, message } from "antd";
import { CSSProperties, SetStateAction, useState } from "react";

const sectionStyle: CSSProperties = {
    marginTop: 10
}

export default function AnnouncedSubjectRequestModal({isOpen, close}: {isOpen: boolean, close: () => void}) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    type chooseType = "registered" | "not_registered";
    const [choose, setChoose] = useState<chooseType>("not_registered");
    const [isLoading, setIsLoading] = useState(false);
    
    const [messageApi, contextHolder] = message.useMessage();

    const onOk = () => {
        setIsLoading(true);

        let data = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim()
        };

        if (choose == "not_registered") {
            if (!(data.firstName && data.lastName)) {
                messageApi.error("Введіть корректні дані.");
                setIsLoading(false);
                return;
            }
        }

        if (!validateEmail(data.email)) {
            messageApi.error("Введіть правильний email!");
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            messageApi.success("Найближчим часом на вашу пошту прийде повідомлення з силкою на вступний іспит!");
            close();
            setIsLoading(false);
        }, 400);
    }

    return (
        <Modal
            title="Заявка на вхід до предмету"
            open={isOpen}
            okText="Подати заявку"
            onOk={onOk}
            onCancel={close}
            confirmLoading={isLoading}
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
                        <h4>Ім'я:</h4>
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
}