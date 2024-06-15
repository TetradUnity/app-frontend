import FullscreenImageModal from "@/components/FullscreenImage";
import { Avatar, Button, Flex } from "antd";
import { useState } from "react";

import { FileFilled, EyeFilled, DownloadOutlined } from "@ant-design/icons";

import styles from "./subject/ResultForTeacher/styles.module.css";
import { fileIsImage, handleDownload } from "@/utils/OtherUtils";

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
                <Flex id={file.name} className={styles.file_slot} key={file.name}>
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
                                onClick={() => handleDownload(file.url)}
                            />
                        </div>
                    </Flex>
                </Flex>
            )}
            <FullscreenImageModal imageUrl={imageUrl} isOpen={imageModalIsOpen} close={() => setImageModalIsOpen(false)} />
        </>
    )
}