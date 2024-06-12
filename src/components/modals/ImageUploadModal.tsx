import { Button, Input, Modal, Segmented, UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";

import { InboxOutlined } from "@ant-design/icons";
import ImgCropModal from "../ImgCropModal";
import { UploadService, UploadType } from "@/services/upload.service";

const FileUploadForm = ({callback, close, imageType } : {imageType?: UploadType, callback: (url: string) => void, close: () => void}) => {
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

    const upload = async () => {
        if (!(fileList[0] && fileList[0].originFileObj)) {
            return;
        }
        
        close();

        let resp = await UploadService.upload(imageType || UploadType.EXAM_RESOURCE, fileList[0].originFileObj);
        if (!resp.success) {
            return;
        }

        callback(UploadService.getImageURL(imageType || UploadType.EXAM_RESOURCE, resp.data));
        setFileList([]);
    }

    return (
        <>
            <ImgCropModal quality={0.8} aspectSlider aspect={1}>
                <Dragger
                    style={{marginTop: 20}}
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
                        } else {
                            setFileList([]);
                        }
                    }}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{color: "white"}} />
                    </p>
                    <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
                    <p className="ant-upload-hint">
                        Суворо заборонено завантажувати дані компанії чи інші заборонені файли.
                    </p>
                </Dragger>
            </ImgCropModal>

            <Button onClick={upload} style={{marginTop: 20}} block type="primary">Завантажити</Button>
        </>
    )
}

const SelectURLForm = ({callback, close} : {callback: (url: string) => void, close: () => void}) => {
    const [url, setUrl] = useState('');

    return (
        <>

            <section style={{marginTop: 15}}>
                <h2>URL:</h2>
                <Input
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com/img-path"
                    type="url"
                />
            </section>

            <Button onClick={() => {
                if (!url) return;
                callback(url);
                close();
            }} style={{marginTop: 20}} block type="primary">Продовжити</Button>
        </>
    )
}

export default function ImageUploadModal(
    {open, setOpen, callback, imageType} :
    {open: boolean, imageType?: UploadType, setOpen: React.Dispatch<React.SetStateAction<boolean>>, callback: (url: string) => void}
) {
    const [type, setType] = useState("upload");

    return (
        <Modal
            title="Завантаження зображення"
            open={open}
            footer={null}
            onCancel={() => setOpen(false)}
        >
            <Segmented
                value={type}
                onChange={type => setType(type)}
                options={[
                    {value: "upload", label: "З пристрою"},
                    {value: "url", label: "URL"}
                ]}
                block
            />

           {(type == "upload") ?
            <FileUploadForm imageType={imageType} callback={callback} close={setOpen.bind(null, false)} /> :
            <SelectURLForm callback={callback} close={setOpen.bind(null, false)} />}
        </Modal>
    )
}