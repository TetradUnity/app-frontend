'use client';

import { useSubjectStore } from "@/stores/subjectStore"
import { ITestShortInfo } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import styles from "../styles.module.css";
import Link from "next/link";
import dayjs from "dayjs";

import { RightOutlined } from "@ant-design/icons";

function TestSlot({item} : {item: ITestShortInfo}) {
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

export default function SubjectTestsPage() {
    const tests = useSubjectStore(useShallow(state => state.tests));

    return (
        <>
        {
            (tests.length > 0)
            ? tests.map((item, k) => <TestSlot item={item} key={k} />)
            : <p className={styles.empty_text}>Тестів поки ще немає.</p>
        }
        </>
    )
}