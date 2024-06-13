'use client';

import { Button, Divider, Spin } from "antd";

import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { IStudentShortInfo, SubjectNamespace, TestsNamespace } from "@/types/api.types";
import ResultForTeacher from "@/components/subject/ResultForTeacher";

import { FormOutlined, ClockCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

import styles from "@/styles/announced_subject.module.css";
import TestResult from "@/components/TestResult";
import dayjs from "dayjs";
import { formatTimeInSeconds } from "@/utils/TimeUtils";

const MOCK_STUDENTS: IStudentShortInfo[] = [
    {
        id: 0,
        first_name: "Григорій",
        last_name: "Кущ",
        avatar: ""
    },
    {
        id: 0,
        first_name: "Галина",
        last_name: "Калина",
        avatar: ""
    },
    {
        id: 0,
        first_name: "Стас",
        last_name: "Рис",
        avatar: ""
    }
];

const RenderForTeacher = () => {
    const dedlineExpire = true;

    return (
        dedlineExpire
            ? <ResultForTeacher type="test" students={MOCK_STUDENTS} />
            : <p style={{textAlign: "center"}}>Ви зможете подивитись домашнє завдання учнів після того, як пройде дедлайн.</p>
    )
}

const MOCK_QUESTIONS: TestsNamespace.CandidateQuestion[] = [
    {
        title: "Питання",
        answers: [
            {content: "Відповідь 1", isCorrect: undefined},
            {content: "Відповідь 2", isCorrect: undefined},
            {content: "Відповідь 3", isCorrect: undefined},
        ],
        type: "ONE_ANSWER",
        your_answer: [0]
    },
    {
        title: "Питання",
        answers: [
            {content: "Відповідь 1", isCorrect: undefined},
            {content: "Відповідь 2", isCorrect: undefined},
            {content: "Відповідь 3", isCorrect: undefined},
        ],
        type: "MULTI_ANSWER",
        your_answer: [0, 1]
    }
]

const RenderForStudent = () => {
    const isDedline = false;
    const answersExists = true;
    const isMaxAttempts = false;

    return (
        <div>
            {answersExists &&
                <>
                    <h3>Ваші відповіді:</h3>
                    <TestResult slotColor="var(--foreground-lighter)" questions={MOCK_QUESTIONS} />
                    <Divider />
                </>
            }

            <Button disabled={isDedline || isMaxAttempts} style={{display: "block", margin: "auto"}} type="primary">Пройти тест</Button>
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

            <div className={styles.content + " " + styles.no_padding}>
                <h3 style={{marginBottom: 10}}>Загальна інформація:</h3>
                <section>
                    <h1 style={{marginBottom: 5}}><ClockCircleOutlined style={{color: "#e62780"}} /> Час на проходження:</h1>
                    <p>{(material.duration > 0) ? formatTimeInSeconds(material.duration) : "не вказано"}</p>
                </section>

                {role == "STUDENT" &&
                    <section>
                        <h1 style={{marginBottom: 5}}><InfoCircleOutlined style={{color: "#3489eb"}} /> Кількість спроб:</h1>
                        <p>{material.your_attempts}/{material.available_attempt}</p>
                    </section>
                }
            </div>

            
            <Divider />

            {role == "TEACHER" ? <RenderForTeacher /> : <RenderForStudent />}
        </>
    )
}