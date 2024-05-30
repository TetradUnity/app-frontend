'use client';

import { TestsNamespace } from "@/types/api.types";
import { Button, Checkbox, Input, Radio, Space } from "antd";
import { useParams } from "next/navigation";

import styles from "./styles.module.css";
import React, { useEffect, useImperativeHandle, useState } from "react";
import Tiptap from "@/components/Tiptap";
import countWordsInHtmlString from "@/utils/StringUtils";

import { ClockCircleOutlined } from "@ant-design/icons";
import { formatTimeInSeconds2 } from "@/utils/TimeUtils";
import { useTestStore } from "@/stores/testStore";

// TODO: Content Security Policy

const MOCK_TEST_INFO: TestsNamespace.ProdTest = [
    {
        time: 40 * 60
    },

    {
        title: "<p>Які явища вивчає <b>фізика</b>?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>географічні</p>"},
            {content: "<p>біологічні</p>"},
            {content: "<p>фізичні</p>"},
            {content: "<p>хімічні</p>"},
        ],
    },
    {
        title: "<p>Що з даного переліку є <b>фізичними явищами</b>?</p>",
        type: "MULTI_ANSWER",
        answers: [
            {content: "<p>гроза</p>"},
            {content: "<p>реакція</p>"},
            {content: "<p>вибух</p>"},
            {content: "<p>райдуга</p>"},
        ],
    },
    {
        title: "<p>Фізична величина, яка характеризує масу речовини позначається буквою: </p>",
        type: "TEXT",
        answers: [
        ],
    },
]

type QuestionRenderParams = {
    question: TestsNamespace.ProdQuestion,
    index: number
}
type AnswerRenderRef = {
    getData: () => number | number[] | string | null
}

const OneAnswerRender = React.forwardRef(({question, index} : QuestionRenderParams, ref) => {
    const value = useTestStore(state => state.answers[index]);
    const setValue = useTestStore(state => state.setAnswer.bind(null, index));

    useImperativeHandle(ref, () => ({
        getData: () => value
    } as AnswerRenderRef));

    return (
        <Radio.Group value={value} onChange={val => setValue(val.target.value)}>
            <Space direction="vertical">
                {question.answers.map((answer,i) => 
                    <Radio key={i} value={i}>
                        <Tiptap editable={false} content={answer.content} />
                    </Radio>
                )}
            </Space>
        </Radio.Group>
    )
})

const MultiAnswersRender = React.forwardRef(({question, index} : QuestionRenderParams, ref) => {
    const values = useTestStore(state => state.answers[index]);
    const setValues = useTestStore(state => state.setAnswer.bind(null, index));

    useImperativeHandle(ref, () => ({
        getData: () => values
    } as AnswerRenderRef));

    return (
        <Checkbox.Group
            value={values as number[]}
            onChange={values => setValues(values)}
            options={
                question.answers.map((answer, i) => ({label: <Tiptap editable={false} content={answer.content} />, value: i}))
            }
        />
    )
});

const TextAnswerRender = React.forwardRef(({question, index} : QuestionRenderParams, ref) => {
    const value = useTestStore(state => state.answers[index]) || '';
    const setValue = useTestStore(state => state.setAnswer.bind(null, index));

    useImperativeHandle(ref, () => ({
        getData: () => value
    } as AnswerRenderRef));

    return (
        <Input
            value={value as string}
            onChange={e => setValue(e.target.value)}
        />
    )
});

const Question = React.forwardRef(({question, index} : QuestionRenderParams, ref) => {
    const answerRef = React.useRef<AnswerRenderRef>();

    useImperativeHandle(ref, () => ({
        getData: () => answerRef.current?.getData()
    } as AnswerRenderRef));

    return (
        <>
            <Tiptap style={{marginBottom: 10, fontSize: (countWordsInHtmlString(question.title) > 7) ? 23 : 30}} editable={false} content={question.title} />

            {question.type == "ONE_ANSWER" &&
                <OneAnswerRender ref={answerRef} question={question} index={index} />
            }

            {question.type == "MULTI_ANSWER" &&
                <MultiAnswersRender ref={answerRef} question={question} index={index} />
            }

            {question.type == "TEXT" &&
                <TextAnswerRender ref={answerRef} question={question} index={index} />
            }
        </>
    )
});

export default function TestPage() {
    const params = useParams();
    let { slug: testUID } = params;

    const [testInfo, setTestInfo] = useState<TestsNamespace.ProdTest["0"]>();
    const [questions, setQuestions] = useState<TestsNamespace.ProdQuestion[]>([]);
    
    const [selectedQuestion, setSelectedQuestion] = useState(0);

    const [isLoaded, setIsLoaded] = useState(false);

    const questionRef = React.useRef<AnswerRenderRef>();
    const testStore = useTestStore();
    
    useEffect(() => {
        setQuestions(MOCK_TEST_INFO.filter((_, i) => i > 0) as TestsNamespace.ProdQuestion[]);
        setTestInfo(MOCK_TEST_INFO[0]);

        setIsLoaded(true);
    }, []);

    if (!isLoaded) {
        return;
    }

    if (!testInfo) {
        return;
    }

    const submit = () => {
        alert(JSON.stringify(testStore.answers));
    }

    return (
        <div className={styles.main}>
            <div className={styles.sider}>
                {questions.map((question, i) =>
                <Button
                    key={i}
                    type={selectedQuestion == i ? "primary" : "default"}
                    block
                    onClick={() => setSelectedQuestion(i)}
                >
                    Питання №{i + 1}
                </Button>)}
            </div>

            <div className={styles.divider} />

            <div className={styles.content}>
                <div className={styles.content_inner}>
                    <div className={styles.clock}>
                        <ClockCircleOutlined style={{color: "#349feb"}} />
                        <p>{formatTimeInSeconds2(testInfo.time)}</p>
                    </div>

                    <h3 style={{marginBottom: 5, color: "rgb(200,200,200)"}}>Питання №{selectedQuestion + 1}</h3>

                    <Question ref={questionRef} question={questions[selectedQuestion]} index={selectedQuestion} />

                    <div className={styles.buttons}>
                        <Button onClick={() => setSelectedQuestion(selectedQuestion - 1)} disabled={selectedQuestion == 0} style={{display: "block"}} type="primary">Попереднє питання</Button>
                        <Button onClick={() => setSelectedQuestion(selectedQuestion + 1)} disabled={selectedQuestion == questions.length-1} style={{display: "block"}} type="primary">Наступне питання</Button>
                    </div>

                    {(selectedQuestion == questions.length-1) &&
                        <Button onClick={submit} style={{display: "block", margin: "auto", marginTop: 20}} type="primary">Здати тест</Button>
                    }
                </div>
            </div>
        </div>
    )
}