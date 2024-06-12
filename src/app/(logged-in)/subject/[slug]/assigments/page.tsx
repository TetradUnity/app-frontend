'use client';

import { useSubjectStore } from "@/stores/subjectStore"
import { IMaterialShortInfo, SubjectNamespace } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import { RightOutlined, PlusCircleFilled } from "@ant-design/icons";

import styles from "../styles.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import { Button, Divider, Empty, Spin } from "antd";
import { useRouter } from "next/navigation";
import translateRequestError from "@/utils/ErrorUtils";
import { useProfileStore } from "@/stores/profileStore";

function MaterialSlot({item} : {item: SubjectNamespace.IEducationMaterial}) {
    const date = dayjs(item.time_created);
    
    const subjectId = useSubjectStore(useShallow(state => state.subject.id));

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

export default function AssigmnentsPage() {
    const materials = useSubjectStore(useShallow(state => state.materials.filter(material => !material.is_test)));
    const materialsFetchStatus = useSubjectStore(useShallow(state => state.materialsFetchingStatus));

    const subjectId = useSubjectStore(useShallow(state => state.subject.id));

    const role = useProfileStore(useShallow(state => state.role));

    const { push } = useRouter();

    if (materialsFetchStatus == "FETCHING" || materialsFetchStatus == "NOT_FETCHED") {
        return <Spin size="large" style={{display: "block", margin: "auto"}} spinning />
    } else if (materialsFetchStatus != "SUCCESS") {
        return <p style={{textAlign: "center", fontSize: 30}}>Трапилась помилка: {translateRequestError(materialsFetchStatus)}</p>
    }

    return (
        <>
           {role == "TEACHER" &&
                <>
                    <Button
                    icon={<PlusCircleFilled/>}
                    type="dashed"
                    block
                    style={{marginBottom: 10}}
                    onClick={() => push("/subject/" + subjectId + "/tests/create")}
                    >
                        Створити тест
                    </Button>
                    <Button
                        icon={<PlusCircleFilled/>}
                        type="dashed"
                        block
                        style={{marginBottom: 15}}
                        onClick={() => push("/subject/" + subjectId + "/materials/create")}
                    >
                        Створити матеріал
                    </Button>

                    <Divider />
                </>
            }
            
            {
                (materials.length > 0)
                ? materials.map((item, k) => <MaterialSlot item={item} key={k} />)
                : <Empty description={<p className={styles.empty_text}>Завданнь поки ще немає.</p>}/>
            }
        </>
    )
}