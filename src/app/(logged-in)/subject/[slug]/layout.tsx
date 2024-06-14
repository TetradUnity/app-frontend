'use client';

import { SubjectService } from "@/services/subject.service";
import { useAppStore } from "@/stores/appStore";
import { useSubjectStore } from "@/stores/subjectStore";
import { notFound, useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./styles.module.css";
import { Button, Modal, Segmented } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import translateRequestError from "@/utils/ErrorUtils";
import { useDeviceStore } from "@/stores/deviceStore";

export default function SubjectLayout({children} : {children?: React.ReactNode}) {
    const params = useParams();
    let { slug } = params;

    const isLoading = useAppStore(store => store.isLoading);
    const setIsLoading = useAppStore(store => store.setLoading);
    const setFailedToLoad = useAppStore(store => store.setFailedToLoad);

    const [ subjectNotFound, setSubjectNotFound ] = useState(false);

    const store = useSubjectStore();

    const pathname = usePathname();
    const { push } = useRouter();

    const subjectId = parseInt(slug as string);

    const role = useProfileStore(useShallow(state => state.role));

    const [modal, modalCtx] = Modal.useModal();

    const deviceType = useDeviceStore(state => state.type);

    if (!subjectId || subjectId < 0) {
        notFound();
    }

    useEffect(() => {
        if ((pathname.endsWith("students")) && store.studentsFetchingStatus == "NOT_FETCHED") {
            store.updateStudentsFetchStatus("FETCHING");

            SubjectService.getStudents(subjectId).then(response => {
                if (!response.data) {
                    store.updateStudentsFetchStatus(response.error_code as string);
                    return;
                }

                store.updateStudents(response.data);
                store.updateStudentsFetchStatus("SUCCESS");
            })
        }
    }, [pathname]);

    useEffect(() => {
        setIsLoading(true);

        SubjectService.getSubject(subjectId).then(res => {
            setIsLoading(false);

            if (!res.success) {
                if (res.error_code == "subject_not_found") {
                    setSubjectNotFound(true);
                    return;
                }
                setFailedToLoad(true);
                return;
            }

            if (res.data) {
                store.updateSubjectInfo({...res.data, id: subjectId});
            }
        })
    }, []);

    if (isLoading) {
        return null;
    }
    if (subjectNotFound) {
        notFound();
    }

    const shouldShow = pathname.split("/").length != 5;

    const anim = {opacity: shouldShow ? 1 : 0, height: shouldShow ? "auto" : 0};

    const sections = [
        {label: "Завдання", value: "assignments"},
        {label: "Студенти", value: "students"},
        {label: "Календар", value: "timetable"},
    ];
    if (role == "STUDENT") {
        sections.push(
            {label: "Оцінки", value: "grades"}
        )
    }

    const deleteSubject = () => {
        modal.confirm({
            title: "Завершення предмету",
            content: <p>Ви впевнені що хочете завершити предмет? Всі завдання, тести та навчальні матеріали зникнуть.</p>,
            onOk: () => {
                SubjectService.finishSubject(subjectId).then(resp => {
                    if (!resp.success) {
                        modal.error({
                            title: "Невдача",
                            content: <p>Не вдалося завершити предмет: {translateRequestError(resp.error_code)}</p>
                        });
                        return;
                    }

                    modal.success({
                        title: "Успіх",
                        content: <p>Ваш предмет було завершено!</p>,
                        onOk: () => window.location.href = "/",
                        onCancel: () => window.location.href = "/"
                    });
                })
            }
        })
    }

    return (
       <div>
            <motion.div animate={anim} initial={anim}>
                <div
                    style={{backgroundImage: "url(" + store.subject.banner + ")", position: "relative"}}
                    className={styles.header_div + (shouldShow ? "" : " rm-pe")}
                >
                        <h1>{store.subject.title}</h1>
                        <Link href={"/profile/" + store.subject.teacher_id}><p><b>Викладач: </b><i>{store.subject.teacher_first_name} {store.subject.teacher_last_name}</i></p></Link>

                        {role == "TEACHER" &&
                            <div className={styles.delete_subject}>
                                <Button className={styles.deleteSubjectButton} danger type="primary" onClick={deleteSubject}>Завершити предмет</Button>
                            </div>
                        }
                </div>

                <Segmented
                    className={styles.segmented}
                    defaultValue={pathname.split("/")[3]}
                    options={sections}
                    onChange={key => {
                        push("/subject/" + slug + "/" + key);
                    }}
                    size={deviceType == "mobile" ? "middle" : "large"}
                    block
                />
            </motion.div>

            {children}
            {modalCtx}
       </div>
    );
}