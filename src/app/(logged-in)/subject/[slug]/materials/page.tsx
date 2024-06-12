'use client';

import { useSubjectStore } from "@/stores/subjectStore"
import { IMaterialShortInfo } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import { RightOutlined, PlusCircleFilled } from "@ant-design/icons";

import styles from "../styles.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import { Button, Empty } from "antd";
import { useRouter } from "next/navigation";

function MaterialSlot({item} : {item: IMaterialShortInfo}) {
    const date = dayjs(item.date);
    const subjectId = useSubjectStore(useShallow(state => state.subjectId));

    return (
        <div className={styles.material_slot + " " + styles.slot_with_arrow}>
            <Link href={"/subject/" + subjectId + "/materials/" + item.id}>
                <h2>{item.title}</h2>
                <p>Опубліковано: <i>{date.format("D MMMM о HH:mm")}</i></p>

                <RightOutlined className={styles.arrow_style} />
            </Link>
         </div>
    )
}

export default function SubjectMaterialsPage() {
    const materials = useSubjectStore(useShallow(state => state.materials));
    
    const subjectId = useSubjectStore(useShallow(state => state.subjectId));
    const { push } = useRouter();

    return (
        <>
            <Button
                icon={<PlusCircleFilled/>}
                type="dashed"
                block
                style={{marginBottom: 15}}
                onClick={() => push("/subject/" + subjectId + "/materials/create")}
            >
                Створити матеріал
            </Button>
            {
                (materials.length > 0)
                ? materials.map((item, k) => <MaterialSlot item={item} key={k} />)
                : <Empty description={<p className={styles.empty_text}>Матеріалів поки ще немає.</p>}/>
            }
        </>
    )
}