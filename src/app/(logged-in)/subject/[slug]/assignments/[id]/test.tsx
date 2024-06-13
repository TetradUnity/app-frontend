'use client';

import { Button, Divider } from "antd";

import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { IStudentShortInfo, SubjectNamespace, TestsNamespace } from "@/types/api.types";
import ResultForTeacher from "@/components/subject/ResultForTeacher";

import { FormOutlined, ClockCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

import styles from "@/styles/announced_subject.module.css";
import TestResult from "@/components/TestResult";
import dayjs from "dayjs";
import { formatTimeInSeconds } from "@/utils/TimeUtils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const RenderForTeacher = ({material} : Props) => {
    let isDedline = material.deadline && material.deadline > 0;
    if (isDedline) {
        isDedline = Date.now() > material.deadline;
    }

    const [test, questions] = useMemo(() => {
        const test: TestsNamespace.Test = JSON.parse(material.content!);
        // @ts-ignore
        const questions: TestsNamespace.Question[] = test.filter((_, i) => i > 0);

        return [test, questions];
    }, []);

    return (
        <div>
            <div className={styles.content + " " + styles.no_padding}>
                <h3 style={{marginBottom: 10}}>Загальна інформація:</h3>
                <section>
                    <h1 style={{marginBottom: 5}}><ClockCircleOutlined style={{color: "#e62780"}} /> Час на проходження:</h1>
                    <p>{(test[0].time > 0) ? formatTimeInSeconds(test[0].time / 1000) : "не вказано"}</p>
                </section>

                <section>
                    <h1 style={{marginBottom: 5}}><InfoCircleOutlined style={{color: "#e62780"}} /> Кількість питань:</h1>
                    <p>{questions.length}</p>
                </section>

                <section>
                    <h1 style={{marginBottom: 5}}><InfoCircleOutlined style={{color: "#3489eb"}} /> Кількість спроб:</h1>
                    <p>{test[0].count_attempts}</p>
                </section>
            </div>

            <Divider />

            <h3>Тест:</h3>
            <TestResult slotColor="var(--foreground-lighter)" questions={questions} />
            
            <Divider />

            {isDedline
                ? <ResultForTeacher type="test" />
                : <p style={{textAlign: "center"}}>Ви зможете подивитись домашнє завдання учнів після того, як пройде дедлайн.</p>
            }
        </div>
    )
}

const RenderForStudent = ({material} : Props) => {
    let isDedline = material.deadline && material.deadline > 0;
    if (isDedline) {
        isDedline = Date.now() > material.deadline;
    }
    const isMaxAttempts = material.your_attempts > material.available_attempt;

    const { slug, id } = useParams();

    return (
        <div>
            {!isDedline 
            ? <>
                    <div className={styles.content + " " + styles.no_padding}>
                    <h3 style={{marginBottom: 10}}>Загальна інформація:</h3>
                    <section>
                        <h1 style={{marginBottom: 5}}><ClockCircleOutlined style={{color: "#e62780"}} /> Час на проходження:</h1>
                        <p>{(material.duration > 0) ? formatTimeInSeconds(material.duration / 1000) : "не вказано"}</p>
                    </section>

                    <section>
                        <h1 style={{marginBottom: 5}}><InfoCircleOutlined style={{color: "#e62780"}} /> Кількість питань:</h1>
                        <p>{material.amount_questions}</p>
                    </section>

                    <section>
                        <h1 style={{marginBottom: 5}}><InfoCircleOutlined style={{color: "#3489eb"}} /> Кількість спроб:</h1>
                        <p>{material.your_attempts}/{material.available_attempt}</p>
                    </section>

                    {material.grade ?
                        <section>
                            <h1 style={{marginBottom: 5}}><InfoCircleOutlined style={{color: "#3489eb"}} /> Оцінка:</h1>
                            <p>{material.grade}</p>
                        </section>
                    : null}
                </div>

                <Divider />
            </>
            : null
            }

            {material.test &&
                <>
                    <h3>Ваші відповіді:</h3>
                    <TestResult slotColor="var(--foreground-lighter)" questions={material.test} />
                </>
            }
            {(isDedline && !material.test) &&
                <>
                    <p style={{fontSize: 27, textAlign: "center", marginTop: 15, fontWeight: "bold"}}>Срок сдачі вийшов</p>
                    <p style={{fontSize: 18, textAlign: "center", color: "rgb(220,220,220)"}}>
                        Ви не встигли надіслати домашнє завдання
                    </p>
                </>
            }

            {!isDedline &&
                <>
                    <Divider />
                    <Link href={"/subject/" + slug + "/tests/" + id}>
                        <Button disabled={isDedline || isMaxAttempts} style={{display: "block", margin: "auto"}} type="primary">
                            Пройти тест
                        </Button>
                    </Link>
                </>
            }
        </div>
    )
}

type Props = {
    material: SubjectNamespace.ISingleEducationTest
};
export default function TestInfoPage({material} : Props) {
    const role = useProfileStore(useShallow(state => state.role));

    return (
        <>
            <h1><FormOutlined style={{color: "var(--primary-light)"}} /> {material.title}</h1>
            <p style={{fontSize: 15, marginTop: 5}}>Опубліковано: <i>{dayjs(material.date).format("D MMMM о HH:mm")}</i></p>
            {(material.deadline > 0) &&
                <p style={{fontSize: 15}}>Здати до: <i>{dayjs(material.deadline).format("D MMMM о HH:mm")}</i></p>
            }

            <Divider style={{marginTop: 14, marginBottom: 14}} />

            {role == "TEACHER" ? <RenderForTeacher material={material} /> : <RenderForStudent material={material} />}
        </>
    )
}