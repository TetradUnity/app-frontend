'use client';

import FullscreenImageModal from "@/components/FullscreenImage";
import { IStudentShortInfo } from "@/types/api.types";
import { Avatar, Button, Divider, Flex, Input, Modal } from "antd";
import { useState } from "react";

import { FileFilled, EyeFilled, DownloadOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";
import { fileIsImage } from "@/utils/OtherUtils";

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
            url: 'https://abrakadabra.fun/uploads/posts/2021-12/1640102595_2-abrakadabra-fun-p-ispisannii-list-2.png',
            type: "image"
        },
        {
            name: "africa.pptx",
            type: "file"
        },
        {
            name: "DCIM_2024_11_07_23_33.jpg",
            url: 'https://abrakadabra.fun/uploads/posts/2021-12/1640102566_1-abrakadabra-fun-p-ispisannii-list-1.jpg',
            type: "image"
        },
        {
            name: "ambasador.pptx",
            type: "file"
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
                            ? mock_files.map(file => 
                                <Flex id={file.name} className={styles.file_slot}>
                                    <Avatar size="large" shape="square" icon={<FileFilled />} src={file.url} />
                                    <Flex style={{flex: 1}} justify="space-between" align="center">
                                        <p>{file.name}</p>

                                        <div>
                                            {fileIsImage(file.name) &&
                                                <Button
                                                    icon={<EyeFilled />}
                                                    type="dashed"
                                                    shape="circle"
                                                    style={{marginRight: 10}}
                                                    onClick={() => {
                                                        setImageUrl(file.url as string);
                                                        setImageModalIsOpen(true);
                                                    }}
                                                />
                                            }
                                             <Button
                                                icon={<DownloadOutlined />}
                                                type="dashed"
                                                shape="circle"
                                            />
                                        </div>
                                    </Flex>
                                </Flex>
                            )
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