'use client';

import Foreground from "@/components/Foreground";
import BackButton from "@/components/subject/BackButton";
import { Button, Divider, Spin } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import translateRequestError from "@/utils/ErrorUtils";

import { useProfileStore } from "@/stores/profileStore";
import { useShallow } from "zustand/react/shallow";
import { IStudentShortInfo, TestsNamespace } from "@/types/api.types";
import ResultForTeacher from "@/components/subject/ResultForTeacher";

import { FormOutlined, ClockCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";

import styles from "@/styles/announced_subject.module.css";
import TestResult from "@/components/TestResult";

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

export default function TestInfoPage() {
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const role = useProfileStore(useShallow(state => state.role));

    useEffect(() => {
        let subjectId = parseInt(id as string);

        if (!subjectId || subjectId < 0) {
            setError("not_found");
            return;
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);
    
    if (error) {
         return (
            <Foreground style={{height: 100}}>
                <BackButton />
                <p style={{textAlign: "center", fontSize: 30}}>Трапилась помилка: {translateRequestError(error)}</p>
            </Foreground>
        )
    }

    if (isLoading) {
        return (
            <Foreground style={{height: 100}}>
                <BackButton />
                <Spin style={{display: "block", margin: "auto"}} spinning />
            </Foreground>
        )
    }

    return (
        <Foreground>
            <BackButton />

            <h1><FormOutlined style={{color: "var(--primary-light)"}} /> Фізика - як наука </h1>
            <p style={{fontSize: 15, marginTop: 5}}>Опубліковано: <i>11 червня, 2024 рік о 19:00</i></p>
            <p style={{fontSize: 15}}>Здати до: <i>12 червня, 2024 рік 15:49</i></p>

            <Divider style={{marginTop: 14, marginBottom: 14}} />

            <div className={styles.content + " " + styles.no_padding}>
                <h3 style={{marginBottom: 10}}>Загальна інформація:</h3>
                <section>
                    <h1 style={{marginBottom: 5}}><ClockCircleOutlined style={{color: "#e62780"}} /> Час на проходження:</h1>
                    <p>15 хвилин</p>
                </section>

                {role == "STUDENT" &&
                    <section>
                        <h1 style={{marginBottom: 5}}><InfoCircleOutlined style={{color: "#3489eb"}} /> Кількість спроб:</h1>
                        <p>0/3</p>
                    </section>
                }
            </div>

            
            <Divider />

            {role == "TEACHER" ? <RenderForTeacher /> : <RenderForStudent />}
        </Foreground>
    )
}