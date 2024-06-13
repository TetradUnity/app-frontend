'use client';

import FullscreenImageModal from "@/components/FullscreenImage";
import { IStudentShortInfo } from "@/types/api.types";
import { Avatar, Button, Divider, Flex, Input, Modal } from "antd";
import { useState } from "react";

import { FileFilled, EyeFilled, DownloadOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";
import { fileIsImage } from "@/utils/OtherUtils";
import FileListViewer from "@/components/FileListViewer";

type MaterialViewerModalProps = {
    isOpen: boolean,
    student: IStudentShortInfo | null,
    close: () => void
};
export default function MaterialViewerModal({isOpen, student, close} : MaterialViewerModalProps) {
    const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    const mock_files = [
        {
            name: "DCIM_2024_11_06_23_23dfhvbdfhjvbhdfvhjdfvhbjdfvhjb.jpg",
            url: "htttp"
        },
        {
            name: "africa.pptx",
            url: "htttp"
        },
        {
            name: "DCIM_2024_11_07_23_33.jpg",
            url: 'https://abrakadabra.fun/uploads/posts/2021-12/1640102566_1-abrakadabra-fun-p-ispisannii-list-1.jpg',
        },
        {
            name: "ambasador.pptx",
            url: "htttp"
        }
    ]

    return (
        <>
            <Modal
                title="Перегляд домашнього завдання"
                open={isOpen}
                footer={<Button type="primary" onClick={close}>Закрити</Button>}
                onCancel={close}
            >
                {student &&
                    <>
                        <p style={{fontSize: 30, textAlign: "center"}}>{student.first_name} {student.last_name}</p>

                        <Divider />

                        {mock_files.length > 0
                            ? <FileListViewer files={mock_files} />
                            : <p>Студент ще нічого не здав.</p>
                        }

                        <Divider />

                        <h3 style={{marginBottom: 10}}>Оцінка:</h3>
                        <Flex gap={10}>
                            <Input type="number" defaultValue="0" />
                            <Button>Змінити</Button>
                        </Flex>
                    </>
                }
            </Modal>

            <FullscreenImageModal imageUrl={imageUrl} isOpen={imageModalIsOpen} close={() => setImageModalIsOpen(false)} />
        </>
    )
}