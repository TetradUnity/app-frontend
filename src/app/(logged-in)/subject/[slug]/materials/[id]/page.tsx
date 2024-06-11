'use client';

import Foreground from "@/components/Foreground";
import Tiptap from "@/components/Tiptap";
import BackButton from "@/components/subject/BackButton";
import { mockMaterialContent } from "@/temporary/data";
import { Button, Divider, Modal, Spin } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import translateRequestError from "@/utils/ErrorUtils";

import Dragger from "antd/es/upload/Dragger";
import { UploadFile } from "antd/lib";

import { FileTextOutlined, CloudUploadOutlined, PaperClipOutlined, DeleteFilled, EyeFilled } from "@ant-design/icons";
import { fileIsImage } from "@/utils/OtherUtils";
import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { IStudentShortInfo } from "@/types/api.types";
import ResultForTeacher from "@/components/subject/ResultForTeacher";
import FullscreenImageModal from "@/components/FullscreenImage";

const MOCK_STUDENTS: IStudentShortInfo[] = [
    {
        id: 0,
        first_name: "Григорій",
        last_name: "Кущ",
        avatar: ""
    },
    {
        id: 0,
        first_name: "Галина",
        last_name: "Калина",
        avatar: ""
    },
    {
        id: 0,
        first_name: "Стас",
        last_name: "Рис",
        avatar: ""
    }
];

const RenderForTeacher = () => {
    const dedlineExpire = true;

    return (
        dedlineExpire
            ? <ResultForTeacher type="material" students={MOCK_STUDENTS} />
            : <p style={{textAlign: "center"}}>Ви зможете подивитись домашнє завдання учнів після того, як пройде дедлайн.</p>
    )
}

const RenderForStudent = () => {
    const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const isAlreadyHomework = false;

    useEffect(() => {
        if (!modalVisible) {
            URL.revokeObjectURL(imageUrl);
        }
    }, [modalVisible]);

    return (
        isAlreadyHomework
        ? <>
            <p style={{textAlign: "center"}}>Ви вже здали домашнє завдання.</p>

            <Button style={{margin: "15px auto", display: "block"}} type="primary" danger>Відмінити</Button>
        </>

        : <>
            <Dragger
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

            <Button style={{margin: "15px auto", display: "block"}} type="primary">Здати домашнє завдання</Button>

            <FullscreenImageModal
                isOpen={modalVisible}
                close={() => setModalVisible(false)}
                imageUrl={imageUrl}
            />
        </>
    )
}

export default function MaterialPage() {
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const role = useProfileStore(useShallow(state => state.role));

    useEffect(() => {
        let subjectId = parseInt(id as string);

        if (!subjectId || subjectId < 0) {
            setError("not_found");
            return;
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    
    if (error) {
         return (
            <Foreground style={{height: 100}}>
                <BackButton />
                <p style={{textAlign: "center", fontSize: 30}}>Трапилась помилка: {translateRequestError(error)}</p>
            </Foreground>
        )
    }

    if (isLoading) {
        return (
            <Foreground style={{height: 100}}>
                <BackButton />
                <Spin style={{display: "block", margin: "auto"}} spinning />
            </Foreground>
        )
    }

    return (
        <Foreground>
            <BackButton />

            <h1><FileTextOutlined style={{color: "var(--primary-light)"}} /> Фізика - як наука. Вступний урок до курсу фізики. Базові поняття</h1>
            <p style={{fontSize: 15, marginTop: 5}}>Опубліковано: <i>11 червня, 2024 рік о 19:00</i></p>
            <p style={{fontSize: 15}}>Здати до: <i>12 червня, 2024 рік 15:49</i></p>

            <Divider style={{marginTop: 14, marginBottom: 14}} />

            <Tiptap
                content={mockMaterialContent}
                editable={false}
            />

            <Divider style={{marginTop: 14, marginBottom: 14}} />


            <h1>Домашнє завдання:</h1>
            {role == "TEACHER" ? <RenderForTeacher /> : <RenderForStudent />}
        </Foreground>
    )
}