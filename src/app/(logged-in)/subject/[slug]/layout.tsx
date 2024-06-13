'use client';

import { SubjectService } from "@/services/subject.service";
import { useAppStore } from "@/stores/appStore";
import { useSubjectStore } from "@/stores/subjectStore";
import { notFound, useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./styles.module.css";
import { Segmented } from "antd";
import { motion } from "framer-motion";
import { EducationService } from "@/services/education.service";
import { UploadService, UploadType } from "@/services/upload.service";
import Link from "next/link";
import {SubjectNamespace} from "@/types/api.types";

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
        }).catch(err => {
            console.log(err)
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

    return (
       <div>
            <motion.div animate={anim} initial={anim}>
                <div
                    style={{backgroundImage: "url(" + store.subject.banner + ")", position: "relative"}}
                    className={styles.header_div + (shouldShow ? "" : " rm-pe")}
                >
                        <h1>{store.subject.title}</h1>
                        <Link href={"/profile/" + store.subject.teacher_id}><p><b>Викладач: </b><i>{store.subject.teacher_first_name} {store.subject.teacher_last_name}</i></p></Link>
                </div>

                <Segmented
                    style={{margin: "20px 0"}}
                    defaultValue={pathname.split("/")[3]}
                    options={[
                        {label: "Завдання", value: "assignments"},
                        {label: "Студенти", value: "students"},
                        {label: "Розклад занять", value: "timetable"},
                        {label: "Оцінки", value: "grades"},
                    ]}
                    onChange={key => {
                        push("/subject/" + slug + "/" + key)
                    }}
                    size="large"
                    block
                />
            </motion.div>

            {children}
       </div>
    );
}