'use client';

import { useSubjectStore } from "@/stores/subjectStore"
import { ITestShortInfo } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import styles from "../styles.module.css";
import Link from "next/link";
import dayjs from "dayjs";

import { RightOutlined } from "@ant-design/icons";
import {Empty} from "antd";

function TestSlot({item} : {item: ITestShortInfo}) {
    let date = dayjs(item.date);
    const subjectId = useSubjectStore(useShallow(state => state.subjectId));

    return (
        <div className={styles.material_slot + " " + styles.slot_with_arrow}>
            <Link href={"/subject/" + subjectId + "/tests/" + item.id}>
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
            : <Empty description={<p className={styles.empty_text}>Тестів поки ще немає.</p>}/>
        }
        </>
    )
}