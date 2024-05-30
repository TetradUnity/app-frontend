'use client';

import { TestsNamespace } from "@/types/api.types";
import { Button } from "antd";
import { useParams } from "next/navigation";

import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Tiptap from "@/components/Tiptap";

// TODO: Content Security Policy

const MOCK_TEST_INFO: TestsNamespace.Test = [
    {
        time: 40 * 60
    },

    {
        title: "<p>Які явища вивчає <b>фізика</b>?</p>",
        type: "ONE_ANSWER",
        answers: [
            {isCorrect: false, content: "<p>географічні</p>"},
            {isCorrect: false, content: "<p>біологічні</p>"},
            {isCorrect: true, content: "<p>фізичні</p>"},
            {isCorrect: false, content: "<p>хімічні</p>"},
        ],
    },
    {
        title: "<p>Що з даного переліку є <b>фізичними явищами</b>?</p>",
        type: "MULTI_ANSWER",
        answers: [
            {isCorrect: true, content: "<p>гроза</p>"},
            {isCorrect: false, content: "<p>реакція</p>"},
            {isCorrect: true, content: "<p>вибух</p>"},
            {isCorrect: true, content: "<p>райдуга</p>"},
        ],
    },
    {
        title: "<p>Фізична величина, яка характеризує масу речовини позначається буквою: </p>",
        type: "TEXT",
        answers: [
            {isCorrect: false, content: "m"},
        ],
    },
]

export default function TestPage() {
    const params = useParams();
    let { slug: testUID } = params;

    const [testInfo, setTestInfo] = useState<TestsNamespace.Test["0"]>();
    const [questions, setQuestions] = useState<TestsNamespace.Question[]>([]);
    
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setQuestions(MOCK_TEST_INFO.filter((_, i) => i > 0) as TestsNamespace.Question[]);
        setTestInfo(MOCK_TEST_INFO[0]);

        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return;
    }

    return (
        <>
            <div className={styles.sider}>
                {questions.map((question, i) =>
                <Button key={i} type="default" block>
                    Питання №{i+1}
                    {/* <Tiptap editable={false} content={(i+1) + ". " + question.title} /> */}
                </Button>)}
            </div>

            <div className={styles.divider} />
        </>
    )
}