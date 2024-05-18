'use client';

import { SubjectService } from "@/services/subject.service";
import { useAppStore } from "@/stores/appStore";
import { useSubjectStore } from "@/stores/subjectStore";
import { notFound, useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./styles.module.css";
import { Segmented } from "antd";

// TODO: fetching from server when it's be ready.
const cover_img = "https://realkm.com/wp-content/uploads/2020/02/teacher-cartoon-board-chalkboard-class-person-1449505-pxhere.com_.jpg";

export default function SubjectLayout({children} : {children?: React.ReactNode}) {
    const params = useParams();
    let { slug } = params;

    const isLoading = useAppStore(store => store.isLoading);
    const setIsLoading = useAppStore(store => store.setLoading);
    const setFailedToLoad = useAppStore(store => store.setFailedToLoad);

    const [ subjectNotFound, setSubjectNotFound ] = useState(false);

    const store = useSubjectStore();

    const { push } = useRouter();

    const pathname = usePathname();

    useEffect(() => {
        setIsLoading(true);

        let subjectId = parseInt(slug as string);

        if (!subjectId || subjectId < 0) {
            notFound();
        }

        SubjectService.mock.getSubject(subjectId).then(res => {
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
                store.updateSubjectInfo({...res.data, subjectId: subjectId});
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

    return (
       <>
       <div
        style={{background: "url(" + cover_img + ")"}}
        className={styles.header_div}
       >
            <h1>{store.title}</h1>
            <p><b>Викладач: </b><i>{store.teacherInfo.first_name} {store.teacherInfo.last_name}</i></p>
       </div>

        <Segmented
            style={{margin: "20px 0"}}
            defaultValue={pathname.split("/")[3]}
            options={[
                {label: "Матеріали", value: "materials"},
                {label: "Тести", value: "tests"},
                {label: "Студенти", value: "students"},
                {label: "Оцінки", value: "grades"}
            ]}
            onChange={key => {
                push("/subject/" + slug + "/" + key)
            }}
            size="large"
            block
        />

        {children}
       </>
    );
}