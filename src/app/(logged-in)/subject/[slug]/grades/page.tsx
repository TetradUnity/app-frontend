'use client';

import { SubjectNamespace } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import styles from "../styles.module.css";
import dayjs from "dayjs";
import {Empty, Spin, message} from "antd";
import { useEffect, useRef, useState } from "react";
import { GradeService } from "@/services/grade.service";
import { notFound, useParams } from "next/navigation";
import translateRequestError from "@/utils/ErrorUtils";
import { useProfileStore } from "@/stores/profileStore";
import { translateGradeReason } from "@/utils/InternalizationUtils";

function GradeSlot({item} : {item: SubjectNamespace.IGrade}) {
    return (
        <div className={styles.material_slot}>
            <h4>Виставлено оцінку {item.value} за {translateGradeReason(item.reason)}.</h4>
            <p><i>{dayjs(item.date).format("D MMMM о HH:mm")}</i></p>
         </div>
    )
}

export default function SubjectGradesPage() {
    const { slug } = useParams();

    const [grades, setGrades] = useState<SubjectNamespace.IGrade[]>([]);
    const [loading, setLoading] = useState(false);
    
    const role = useProfileStore(useShallow(state => state.role));

    const fetchRef = useRef({
        loading: false,
        page: 1,
        isEnd: false
    });

    const fetch = async () => {
        if (fetchRef.current.isEnd) return;
        if (fetchRef.current.loading) return;

        setLoading(true);
        fetchRef.current.loading = true;

        const response = await GradeService.getGrades(parseFloat(slug as string), fetchRef.current.page);

        if (!response.success) {
            setLoading(false);
            message.error("Трапилась помилка при завантажені оцінок: " + translateRequestError(response.error_code))
            return;
        }

        setGrades(prev => [...prev, ...response.data!]);
        fetchRef.current.isEnd = response.data!.length == 0;
        fetchRef.current.page += 1;
        fetchRef.current.loading = false;
        setLoading(false);
    }

    useEffect(() => {
        fetch();

        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
                return;
            }

            fetch();
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (role != "STUDENT") {
        notFound();
    }

    return (
        (loading)
        ? <Spin size="large" style={{display: "block", margin: "auto"}} spinning />
        : <>
            {
                (grades.length > 0)
                ?  grades.map((item, k) => (
                        <GradeSlot item={item} key={k} />
                    ))
                : <Empty description={<p className={styles.empty_text}>У вас поки що немає оцінок.</p>} />
            }
        </>
    )
}