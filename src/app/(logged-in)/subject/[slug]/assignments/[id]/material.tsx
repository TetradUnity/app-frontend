'use client';

import Foreground from "@/components/Foreground";
import Tiptap from "@/components/Tiptap";
import BackButton from "@/components/subject/BackButton";
import { mockMaterialContent } from "@/temporary/data";
import { Button, Divider, Modal, Spin, message } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react"
import translateRequestError from "@/utils/ErrorUtils";

import Dragger from "antd/es/upload/Dragger";
import { UploadFile } from "antd/lib";

import { FileTextOutlined, CloudUploadOutlined, PaperClipOutlined, DeleteFilled, EyeFilled } from "@ant-design/icons";
import { fileIsImage } from "@/utils/OtherUtils";
import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { SubjectNamespace } from "@/types/api.types";
import ResultForTeacher from "@/components/subject/ResultForTeacher";
import FullscreenImageModal from "@/components/FullscreenImage";
import dayjs from "dayjs";
import FileListViewer from "@/components/FileListViewer";
import { UploadService, UploadType } from "@/services/upload.service";
import { RcFile } from "antd/es/upload";
import { EducationService } from "@/services/education.service";

const RenderForTeacher = ({material} : Props) => {
    let isDedline = material.deadline && material.deadline > 0;

    if (!isDedline) {
        return null;
    };

    isDedline = Date.now() > material.deadline;

    return (
        isDedline
            ? <ResultForTeacher type="material" />
            : <p style={{textAlign: "center"}}>Ви зможете подивитись домашнє завдання учнів після того, як пройде дедлайн.</p>
    )
}

const RenderForStudent = ({material} : Props) => {
    const { id } = useParams();
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const [locallyHomework, setLocallyHomework] = useState<string[]>(material.homework);

    const isAlreadyHomework = locallyHomework.length > 0;
    let isDedline = material.deadline && material.deadline > 0;
    if (isDedline) {
        isDedline = Date.now() > material.deadline;
    }

    const [blocked, setIsBlocked] = useState(false);
    const [msg, msgCtx] = message.useMessage();

    useEffect(() => {
        if (!modalVisible) {
            URL.revokeObjectURL(imageUrl);
        }
    }, [modalVisible]);

    if (isDedline) {
        return (
            <>
                <p style={{fontSize: 27, textAlign: "center", marginTop: 15, fontWeight: "bold"}}>Срок сдачі вийшов</p>
                <p style={{fontSize: 18, textAlign: "center", color: "rgb(220,220,220)"}}>
                    {isDedline
                        ? "Ви встигли надіслати домашнє завдання"
                        : "Ви не встигли надіслати домашнє завдання"
                    }
                </p>
            </>
        )
    }

    const submitHomework = async () => {
        if (fileList.length < 1) {
            return;
        }

        setIsBlocked(true);

        let uids = [];
        for (let i = 0; i < fileList.length; i++) {
            const resp = await UploadService.upload(UploadType.HOMEWORK, fileList[i].originFileObj as RcFile);
            if (!resp.success) {
                msg.error("Не вдалось загрузити файл: " + translateRequestError(resp.error_code) + ". Спробуйте ще раз!")
                setIsBlocked(false);
                return;
            }
            uids.push(resp.data);
        }

        const resp = await EducationService.sendHomework(parseInt(id as string), uids);
        
        setIsBlocked(false);

        if (!resp.success) {
            msg.error("Не вдалось загрузити домашню роботу: " + translateRequestError(resp.error_code) + ". Спробуйте ще раз!")
            return;
        }

        setLocallyHomework(uids);
    };

    const rejectHomework = async () => {
        setIsBlocked(true);

        const resp = await EducationService.sendHomework(parseInt(id as string), []);

        setIsBlocked(false);

        if (!resp.success) {
            msg.error("Не вдалось скасувати домашню роботу: " + translateRequestError(resp.error_code) + ". Спробуйте ще раз!")
            return;
        }

        setLocallyHomework([]);
    };

    return (
        isAlreadyHomework
        ? <>
            <FileListViewer files={locallyHomework.map(fileName => ({
                name: fileName,
                url: UploadService.getImageURL(UploadType.HOMEWORK, fileName)
            }))} />

            <Button onClick={rejectHomework} disabled={blocked} style={{margin: "15px auto", display: "block"}} type="primary" danger>Скасувати</Button>
        </>

        : <>
            <Dragger
                disabled={blocked}
                fileList={fileList}
                multiple
                showUploadList={false}
                customRequest={
                    ({file, onSuccess}) => {
                    // @ts-ignore
                        onSuccess("ok");
                    }}
                onChange={(info) => {
                    const arr = [];

                    let file = null;
                    for (let i = 0; i < info.fileList.length; i++) {
                        file = info.fileList[i];
                        if (file.status === "uploading" || file.status === "done") {
                            arr.push(file);
                        }
                    }

                    setFileList(arr);
                }}
                style={{
                    marginTop: 10,
                    height: 150
                }}>
                    <p>
                        <CloudUploadOutlined style={{color: "rgba(255,255,255,0.5)", fontSize: 30}}/>
                    </p>
                    <p style={{
                        fontSize: 17, color: "rgba(255,255,255,0.5)"
                    }}>Натисніть або перетягніть файли</p>
            </Dragger>

            {fileList.map(file => 
                <div key={file.name} style={{
                    padding: 7,
                    background: "var(--foreground-lighter-0_5)",
                    borderRadius: 8,
                    marginTop: 5
                }}>
                    <PaperClipOutlined style={{marginRight: 7}} />
                    {file.name}

                    <div style={{float: "right"}}>
                        {fileIsImage(file.name) &&
                            <Button
                                icon={<EyeFilled style={{color: "#68aee8"}} />}
                                size="small"
                                type="text"
                                shape="circle"
                                style={{marginRight: 3}}
                                onClick={() => {
                                    setImageUrl(URL.createObjectURL(file.originFileObj as Blob));
                                    setModalVisible(true);
                                }}
                            />
                        }
                        <Button
                            icon={<DeleteFilled style={{color: "#e04356"}} />}
                            size="small"
                            type="text"
                            shape="circle"
                            onClick={() => setFileList(fileList.filter(f => f != file))}
                        />
                    </div>
                </div>
            )}

            <Button onClick={submitHomework} disabled={blocked} style={{margin: "15px auto", display: "block"}} type="primary">Здати домашнє завдання</Button>

            <FullscreenImageModal
                isOpen={modalVisible}
                close={() => setModalVisible(false)}
                imageUrl={imageUrl}
            />
            {msgCtx}
        </>
    )
}

type Props = {
    material: SubjectNamespace.ISingleEducationMaterial
};
export default function MaterialInfoPage({material} : Props) {
    const role = useProfileStore(useShallow(state => state.role));

    return (
        <>
            <h1><FileTextOutlined style={{color: "var(--primary-light)"}} /> {material.title}</h1>
            <p style={{fontSize: 15, marginTop: 5}}>Опубліковано: <i>{dayjs(material.date).format("D MMMM о HH:mm")}</i></p>
            {(material.deadline > 0) &&
                <p style={{fontSize: 15}}>Здати до: <i>{dayjs(material.deadline).format("D MMMM о HH:mm")}</i></p>
            }

            <Divider style={{marginTop: 14, marginBottom: 14}} />

            <Tiptap
                content={material.content}
                editable={false}
            />

            <Divider style={{marginTop: 14, marginBottom: 14}} />


            {role == "TEACHER" 
                ? <>
                    <h1>Домашні завдання:</h1>
                    <RenderForTeacher material={material} /> 
                </>
                : <>
                    <h1>Домашнє завдання:</h1>
                    <RenderForStudent material={material} />
                </>
            }
        </>
    )
}