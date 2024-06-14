'use client';

import { SubjectNamespace } from "@/types/api.types";
import { useShallow } from "zustand/react/shallow";

import { RightOutlined, PlusCircleFilled } from "@ant-design/icons";

import styles from "../styles.module.css";
import Link from "next/link";
import dayjs from "dayjs";
import { Button, Divider, Empty, Spin, message } from "antd";
import {useParams, useRouter} from "next/navigation";
import translateRequestError from "@/utils/ErrorUtils";
import { useProfileStore } from "@/stores/profileStore";

import { FormOutlined, FileTextOutlined } from "@ant-design/icons";
import {CSSProperties, useEffect, useRef, useState} from "react";
import { EducationService } from "@/services/education.service";

function MaterialSlot({item} : {item: SubjectNamespace.IEducationMaterial}) {
    const date = dayjs(item.time_created);
    
    const {slug} = useParams();
    const isTest = item.is_test;

    const iconStyles: CSSProperties = {
        marginRight: 3,
        color: "var(--primary-light) !important"
    }
    const icon = isTest ? <FormOutlined style={iconStyles} /> : <FileTextOutlined style={iconStyles} />;

    return (
        <div className={styles.material_slot + " " + styles.slot_with_arrow}>
            <Link href={"/subject/" + slug + "/assignments/" + item.id}>
                <h2 style={{marginBottom: 5}}>{icon} {item.title}</h2>
                <p>Опубліковано: <i>{date.format("D MMMM о HH:mm")}</i></p>

                <RightOutlined className={styles.arrow_style} />
            </Link>
         </div>
    )
}

export default function AssigmnentsPage() {
    const role = useProfileStore(useShallow(state => state.role));

    const { slug } = useParams();
    const { push } = useRouter();

    const [materials, setMaterials] = useState<SubjectNamespace.IEducationMaterial[]>([]);
    const [loading, setLoading] = useState(false);

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

        const response = await EducationService.getEducationMaterials(parseFloat(slug as string), fetchRef.current.page);

        if (!response.success) {
            setLoading(false);
            message.error("Трапилась помилка при завантажені завдань: " + translateRequestError(response.error_code))
            return;
        }

        setMaterials(prev => [...prev, ...response.data!]);
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

    return (
        (loading)
        ? <Spin size="large" style={{display: "block", margin: "auto"}} spinning />
        : <>
           {role == "TEACHER" &&
                <>
                    <Button
                    icon={<PlusCircleFilled/>}
                    type="dashed"
                    block
                    style={{marginBottom: 10}}
                    onClick={() => push("/subject/" + slug + "/tests/create")}
                    >
                        Створити тест
                    </Button>
                    <Button
                        icon={<PlusCircleFilled/>}
                        type="dashed"
                        block
                        style={{marginBottom: 15}}
                        onClick={() => push("/subject/" + slug + "/materials/create")}
                    >
                        Створити матеріал
                    </Button>

                    <Divider />
                </>
            }
            
            {(materials.length > 0)
                    ? materials.map((item) => <MaterialSlot item={item} key={item.id} />)
                    : <Empty description={<p className={styles.empty_text}>Завдань поки що немає.</p>}/>
            }
        </>
    )
}