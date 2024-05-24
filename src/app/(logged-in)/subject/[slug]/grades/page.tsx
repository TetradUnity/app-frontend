'use client';

import { useSubjectStore } from "@/stores/subjectStore"
import { IGrade } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import styles from "../styles.module.css";
import dayjs from "dayjs";
import {Empty, List} from "antd";

function GradeSlot({item} : {item: IGrade}) {
    let date = dayjs(item.date);

    return (
        <div className={styles.material_slot}>
            <h4>Виставлено оцінку {item.grade}: {item.reason}</h4>
            <p><i>{date.format("D MMMM о HH:mm")}</i></p>
         </div>
    )
}

export default function SubjectGradesPage() {
    const grades = useSubjectStore(useShallow(state => state.grades));

    return (
        <>
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
                : <Empty description={<p className={styles.empty_text}>У Вас оцінок поки ще немає.</p>}/>
            }
        </>
    )
}