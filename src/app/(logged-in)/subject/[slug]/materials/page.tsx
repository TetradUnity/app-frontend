'use client';

import { useSubjectStore } from "@/stores/subjectStore"
import { IMaterialShortInfo } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import { RightOutlined } from "@ant-design/icons";

import styles from "../styles.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import {Empty} from "antd";

function MaterialSlot({item} : {item: IMaterialShortInfo}) {
    let date = dayjs(item.date);

    return (
        <div className={styles.material_slot + " " + styles.slot_with_arrow}>
            <Link href={window.location.pathname + "/" + item.id}>
                <h2>{item.title}</h2>
                <p>Опубліковано: <i>{date.format("D MMMM о HH:mm")}</i></p>

                <RightOutlined className={styles.arrow_style} />
            </Link>
         </div>
    )
}

export default function SubjectMaterialsPage() {
    const materials = useSubjectStore(useShallow(state => state.materials));

    return (
        <>
        {
            (materials.length > 0)
            ? materials.map((item, k) => <MaterialSlot item={item} key={k} />)
            : <Empty description={<p className={styles.empty_text}>Матеріалів поки ще немає.</p>}/>
        }
        </>
    )
}