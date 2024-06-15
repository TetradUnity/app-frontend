'use client';

import { IAnnouncedSubject } from "@/types/api.types";
import { notFound, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { ProfileOutlined, LinkOutlined, CheckOutlined, ClockCircleOutlined, CalendarOutlined, FieldTimeOutlined } from "@ant-design/icons";
import {Button, Image, Spin} from "antd";

import styles from "@/styles/announced_subject.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import AnnouncedSubjectRequestModal, { AnnouncedSubjectRequestModalRef } from "@/components/modals/AnnouncedSubjectRequestModal";
import { SubjectService } from "@/services/subject.service";
import { formatTimeInSeconds } from "@/utils/TimeUtils";
import Tiptap from "@/components/Tiptap";
import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import useModal from "antd/es/modal/useModal";
import translateRequestError from "@/utils/ErrorUtils";
import { UploadService, UploadType } from "@/services/upload.service";
import {AnnouncedSubjectService} from "@/services/announced_subject.service";

const ForTeacherRender = ({info, id} : {info: IAnnouncedSubject, id: number}) => {
    if (!info.time_exam_end) {
        return null;
    }

    return (
        <p style={{textAlign: "center"}}>Ви побачите список студентів, які подали заявку на вступ до вашого предмета і зможете видаляти тих, які на вашу думку не підходять, після того, як закінчиться іспит.</p>
    )
}

export default function AnnouncedSubject() {
    const params = useParams();
    let { slug } = params;

    const [info, setInfo] = useState<IAnnouncedSubject>();

    const [isLoaded, setIsLoaded] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const modalRef = React.useRef<AnnouncedSubjectRequestModalRef>()

    const [loading, setLoading] = useState(false);

    const [modal, ctx] = useModal();

    const profileId = useProfileStore(useShallow(state => state.id));
    const role = useProfileStore(useShallow(state => state.role));
    const userEmail = useProfileStore(useShallow(state => state.email));

    const [isNotFound, setNotFound] = useState(false);

    useEffect(() => {
        document.title = "Предмет / " + info?.title || "Предмет не знайдено";
    }, [info])

    const register = (email?: string, first_name?: string, last_name?: string) => {
        if (!first_name) {
            first_name = undefined;
        }
        if (!last_name) {
            last_name = undefined;
        }
        
        setLoading(true);

        AnnouncedSubjectService.register(parseInt(slug as string), email, first_name, last_name).then(response => {
            setLoading(false);

            if (!response.success) {
                modal.error({
                    title: "Помилка.",
                    content: <p>{translateRequestError(response.error_code)}</p>,
                    maskClosable: false,
                    onOk: () => {
                        if (role == "GUEST") {
                            modalRef.current?.set(email!, first_name, last_name);
                            setModalVisible(true);
                        }
                    }
                });
                return;
            }

            modal.success({
                title: "Успіх!",
                content: <p>Протягом найближчого часу очікуйте лист в своїй поштовій скринькі.</p>
            })
        })
    }

    const onClickedRegister = () => {
        if (role == "GUEST") {
            setModalVisible(true);
            return;
        }

        register();
    }

    useEffect(() => {
        let subjectId = parseInt(slug as string);

        if (!subjectId || subjectId < 0) {
            setNotFound(true);
            return;
        }

        AnnouncedSubjectService.getAnnouncedSubjectInfo(subjectId).then(response => {
            setIsLoaded(true);

            if (!response.success) {
                setNotFound(true);
                return;
            }

            setInfo(response.data);
        })
    }, [])

    if (!isLoaded) {
        return null;
    }

    if (isNotFound || !info) {
        notFound();
    }

    return (
        <div className={styles.slot}>
            <div className={styles.banner}>
                <img src={UploadService.getImageURL(UploadType.BANNER, info.banner)} alt="banner" />
                <h1>{info.title}</h1>
                <Link href={"/profile/"+info.teacher_id}>
                    <LinkOutlined style={{marginRight: 5}} />
                    {info.teacher_first_name} {info.teacher_last_name}
                </Link>
            </div>

           <div className={styles.content}>
                <section>
                    <h1><ProfileOutlined style={{color: "#eab676"}} /> Опис:</h1>
                    <Tiptap
                        editable={false}
                        content={info.description}
                        charsLimit={10000}
                    />
                </section>

                <section>
                    <h1><ClockCircleOutlined style={{color: "#68a2ed"}} /> Тривалість:</h1>
                    <p>{formatTimeInSeconds(info.duration / 1000)}</p>
                </section>

                <section>
                    <h1><CalendarOutlined style={{color: "#e62780"}} /> Розклад заннять:</h1>
                    <p>{info.timetable}</p>
                </section>
                
                <section>
                    <h1><FieldTimeOutlined style={{color: "#abdbe3"}} /> Початок предмету:</h1>
                    <p>{dayjs(info.time_start).format("D MMMM YYYY року")}</p>
                </section>

                <section>
                    <h1><FieldTimeOutlined style={{color: "#abdbe3"}} /> Подати заявку можна до:</h1>
                    <p>{dayjs(info.time_exam_end).format("D MMMM YYYY року")}</p>
                </section>

                <section>
                    <h1><CheckOutlined style={{color: "#00ff5e"}} /> Вступний екзамен:</h1>
                    <p>{(info.duration_exam && info.duration_exam > 0) ? "Існує" : "Не існує"}</p>
                </section>

                {(info.duration_exam && info.duration_exam > 0)
                    ? <section>
                        <h1><FieldTimeOutlined style={{color: "#abdbe3"}} /> Тривалість екзамену:</h1>
                        <p>{formatTimeInSeconds(info.duration_exam / 1000)}</p>
                     </section>
                     : null
                }
                {(role == "STUDENT" || role == "GUEST") && 
                    <Button onClick={onClickedRegister} style={{display: "block", margin: "auto"}} type="primary">
                        Подати заявку
                    </Button>
                }

                {(info.teacher_id == profileId) &&
                   <ForTeacherRender info={info} id={parseInt(slug as string)} />
                }
           </div>

           {loading && <Spin fullscreen />}
           {ctx}
           <AnnouncedSubjectRequestModal
            ref={modalRef}
            isOpen={modalVisible}
            close={() => setModalVisible(false)}
            callback={register}
           />
        </div>
    )
}