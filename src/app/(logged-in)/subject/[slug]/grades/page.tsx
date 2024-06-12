'use client';

import { useSubjectStore } from "@/stores/subjectStore"
import { SubjectNamespace } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import styles from "../styles.module.css";
import dayjs from "dayjs";
import {Empty, List, Spin, message} from "antd";
import { useEffect, useState } from "react";
import { EducationService } from "@/services/education.service";
import { GradeService } from "@/services/grade.service";
import { useParams } from "next/navigation";
import translateRequestError from "@/utils/ErrorUtils";

function GradeSlot({item} : {item: SubjectNamespace.IGrade}) {
    return (
        <div className={styles.material_slot}>
            <h4>Виставлено оцінку {item.value}: {item.reason}</h4>
            <p><i>{dayjs(item.date).format("D MMMM о HH:mm")}</i></p>
         </div>
    )
}

export default function SubjectGradesPage() {
    const { slug } = useParams();

    const [grades, setGrades] = useState<SubjectNamespace.IGrade[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [maxPages, setMaxPages] = useState(0);

    const [msg, msgCtx] = message.useMessage();

    const fetch = async () => {
        if (loading) return;

        setLoading(true);

        const response = await GradeService.getGrades(parseFloat(slug as string), page);

        setLoading(false);

        if (!response.success) {
            msg.error("Трапилась помилка при завантажені оцінок: " + translateRequestError(response.error_code))
            return;
        }

        setGrades(prev => [...prev, ...response.data as SubjectNamespace.IGrade[]]);
        setMaxPages(response.max_pages);
        setPage(prev => prev + 1);
    }

    useEffect(() => {
        fetch();
    }, []);

    return (
        <>
            {loading && <Spin spinning fullscreen />}
            {
                (grades.length > 0)
                ?  <List
                        pagination={{pageSize: 10}}
                        dataSource={grades}
                        size="small"
                        renderItem={(item, k) => (
                            <GradeSlot item={item} key={k} />
                        )}
                    />
                : <Empty description={<p className={styles.empty_text}>У Вас оцінок поки ще немає.</p>} />
            }
            {msgCtx}
        </>
    )
}