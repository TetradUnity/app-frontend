import { Button, Input, Modal, Segmented, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";

import { InboxOutlined } from "@ant-design/icons";

const props: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {

    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
};

const FileUploadForm = ({callback, close} : {callback: (url: string) => void, close: () => void}) => {
    return (
        <>
            <Dragger style={{marginTop: 20}} {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined style={{color: "white"}} />
                </p>
                <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
                <p className="ant-upload-hint">
                    Суворо заборонено завантажувати дані компанії чи інші заборонені файли.
                </p>
            </Dragger>

            <Button style={{marginTop: 20}} block type="primary">Продовжити</Button>
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
                    placeholder="https://example.com/img-url"
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
    {open, setOpen, callback} :
    {open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, callback: (url: string) => void}
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
            <FileUploadForm callback={callback} close={setOpen.bind(null, false)} /> :
            <SelectURLForm callback={callback} close={setOpen.bind(null, false)} />}
        </Modal>
    )
}