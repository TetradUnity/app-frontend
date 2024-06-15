import { Page, Document } from "react-pdf";
import { UploadService, UploadType } from "@/services/upload.service";
import { Button, Modal } from "antd";

export default function CertificateModal({open, setOpen, signature} : {open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, signature: string}) {
    return (
        <Modal
            title="Сертифікат"
            open={open}
            maskClosable={false}
            width={890}
            footer={
                <Button
                    danger 
                    type="primary"
                    style={{display: "block", marginRight: "auto"}}
                    onClick={() => setOpen(false)}
                >
                    Закрити
                </Button>
            }
        >
            <Document file={UploadService.getImageURL(UploadType.CERTIFICATES, signature + ".pdf")} onLoadSuccess={e => console.log(e)}>
                <Page pageNumber={1} scale={1} />
            </Document>
        </Modal>
    )
}