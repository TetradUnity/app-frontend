import FullscreenImageModal from "@/components/FullscreenImage";
import { Avatar, Button, Flex } from "antd";
import { useState } from "react";

import { FileFilled, EyeFilled, DownloadOutlined } from "@ant-design/icons";

import styles from "./subject/ResultForTeacher/styles.module.css";
import { fileIsImage } from "@/utils/OtherUtils";

const handleDownload = (fileUrl: string) => {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    var img = new Image();
    img.src = fileUrl;
    img.setAttribute('crossOrigin', '');

    var array = fileUrl.split("/");
    var fileName = array[array.length - 1];

    img.onload = function() {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img,
            0, 0, img.naturalWidth, img.naturalHeight,
            0, 0, canvas.width, canvas.height);

        var dataUrl = canvas.toDataURL("image/png", 1);

        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
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