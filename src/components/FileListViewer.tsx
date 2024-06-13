import FullscreenImageModal from "@/components/FullscreenImage";
import { IStudentShortInfo } from "@/types/api.types";
import { Avatar, Button, Divider, Flex, Input, Modal } from "antd";
import { useState } from "react";

import { FileFilled, EyeFilled, DownloadOutlined } from "@ant-design/icons";

import styles from "./subject/ResultForTeacher/styles.module.css";
import { fileIsImage } from "@/utils/OtherUtils";

const handleDownload = (fileUrl: string, download: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = download;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

type Props = {
    files: {
        name: string,
        url: string
    }[]
};
export default function FileListViewer({files} : Props) {
    const [imageModalIsOpen, setImageModalIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    return (
        <>  
            {files.map(file => 
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
                                    onClick={() => handleDownload(file.url, file.name)}
                                />
                        </div>
                    </Flex>
                </Flex>
            )}
            <FullscreenImageModal imageUrl={imageUrl} isOpen={imageModalIsOpen} close={() => setImageModalIsOpen(false)} />
        </>
    )
}