'use client';

import {TestsNamespace} from "@/types/api.types";
import { Button, Checkbox, Input, Modal, Radio, Space, Spin } from "antd";
import { notFound, useParams } from "next/navigation";

import styles from "./styles.module.css";
import React, {useEffect, useState} from "react";
import Tiptap from "@/components/Tiptap";

import { ClockCircleOutlined } from "@ant-design/icons";
import { formatTimeInSeconds2 } from "@/utils/TimeUtils";
import { useTestStore } from "@/stores/testStore";
import { AnnouncedSubjectService } from "@/services/announced_subject.service";

import translateRequestError from "@/utils/ErrorUtils";
import { pluralize } from "@/utils/InternalizationUtils";

// TODO: Content Security Policy

type QuestionRenderParams = {
    question: TestsNamespace.ProdQuestion,
    index: number
}

const OneAnswerRender = ({question, index}: QuestionRenderParams) => {
    const value = useTestStore(state => state.answers[index]);
    const setValue = useTestStore(state => state.setAnswer.bind(null, index));

    return (
        <Radio.Group value={value && value[0]} onChange={val => setValue([val.target.value])}>
            <Space direction="vertical">
                {question.answers.map((answer, i) =>
                    <Radio key={i} value={i}>
                        <Tiptap style={{fontSize: 17}} editable={false} content={answer}/>
                    </Radio>
                )}
            </Space>
        </Radio.Group>
    )
};

const MultiAnswersRender = ({question, index}: QuestionRenderParams) => {
    const values = useTestStore(state => state.answers[index]);
    const setValues = useTestStore(state => state.setAnswer.bind(null, index));

    return (
        <Checkbox.Group
            value={values as number[]}
            onChange={values => setValues(values)}
            options={
                question.answers.map((answer, i) => ({
                    label: <Tiptap style={{fontSize: 17, margin: "3px 0"}} editable={false} content={answer}/>,
                    value: i
                }))
            }
        />
    )
};

const TextAnswerRender = ({question, index}: QuestionRenderParams) => {
    const value = useTestStore(state => state.answers[index]) || [''];
    const setValue = useTestStore(state => state.setAnswer.bind(null, index));

    return (
        <Input
            value={value[0]}
            onChange={e => setValue([e.target.value])}
        />
    )
};

const Question = ({question, index}: QuestionRenderParams) => {
    return (
        <>
            <Tiptap style={{marginBottom: 10, fontSize: 23}}
                    editable={false} content={question.title}/>

            {question.type == "ONE_ANSWER" &&
                <OneAnswerRender question={question} index={index}/>
            }

            {question.type == "MULTY_ANSWER" &&
                <MultiAnswersRender question={question} index={index} />
            }

            {question.type == "TEXT" &&
                <TextAnswerRender question={question} index={index}/>
            }
        </>
    )
};

const Timer = ({timeEnd, setIsTimeUp}: {timeEnd: number | undefined, setIsTimeUp: React.Dispatch<React.SetStateAction<boolean>>}) => {
    if (!timeEnd) {
        return null;
    }

    const [_, setForce] = useState(false);

    useEffect(() => {
        let id = setInterval(() => {
            setForce(v => !v);
            
            if (Date.now() > timeEnd) {
                setIsTimeUp(true);
                clearInterval(id);
            }
        }, 100);

        return () => clearInterval(id);
    }, []);

    return (
        <div className={styles.clock}>
            <ClockCircleOutlined style={{color: "#349feb"}}/>
            <p>{formatTimeInSeconds2(Math.max(timeEnd - Date.now(), 0) / 1000)}</p>
        </div>
    )
}

export default function TestPage() {
    const params = useParams();
    let {slug: testUID} = params;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isTimeUp, setIsTimeUp] = useState(false);

    const [questions, setQuestions] = useState<TestsNamespace.ProdQuestion[]>([]);
    const [timeEnd, setTimeEnd] = useState<number | undefined>(undefined);

    const [selectedQuestion, setSelectedQuestion] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState<TestsNamespace.AnswerType>([undefined]);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isNotFound, setNotFound] = useState(false);

    const [modal, modalCtx] = Modal.useModal();

    const testStore = useTestStore();

    const fetch = (uid: string | string[]) => {
        AnnouncedSubjectService.startExam(uid as string).then(res => {
            if (!(res.data && res.time_end)) {
                setIsLoaded(true);
                setNotFound(true);
                return;
            }
            
            let questions = res.data;

            if (Date.now() > res.time_end) {
                setIsTimeUp(true);
                setIsLoaded(true);
                return;
            }

            testStore.setTotalQuestions(questions.length);
            setQuestions(questions);
            setTimeEnd(res.time_end);
            
            setIsLoaded(true);
        });
    }


    const showModal = () => {
        setIsModalVisible(true);
    };

    const hideModal = () => {
        setIsModalVisible(false);
    };

    const handleOk = () => {
        submit();
        setIsModalVisible(false);
    };

    const submit = () => {
        AnnouncedSubjectService.finishExam(testUID as string, testStore.getAnswers()).then(resp => {
            if (!resp.success) {
                modal.error({
                    title: "Помилка",
                    content: <p>Закінчити тест не вдалось: {translateRequestError(resp.error_code)}</p>
                })
                return;
            }

            modal.success({
                title: "Успіх",
                // @ts-ignore
                content: <p>Ви здали на {pluralize(Math.round(resp.result), ["бал", "бала", "балів"])} (прохідний бал: {resp.passing_grade}). Відповіді надійдуть до вчителя. Слідкуйте за повідомлення в скринькі!</p>,
                onOk: () => window.location.href = "/subjects",
                onCancel: () => window.location.href = "/subjects"
            })
        })
    }

    useEffect(() => {
        fetch(testUID);
    }, []);

    const save = async () => {
        console.log(currentAnswer, testStore.answers[selectedQuestion])
        if (currentAnswer == testStore.answers[selectedQuestion]) {
            return;
        }

        AnnouncedSubjectService.updateAnswers(testUID as string, testStore.getAnswers()).then(resp => {
            if (!resp.success) {
                modal.error({
                    title: "Помилка при зберіганні",
                    content: <p>При зберіганні відповіді трапилась помилка: {translateRequestError(resp.error_code)}</p>
                })
            }
        })
    }

    const nextQuestion = () => {
        save();
        setSelectedQuestion(selectedQuestion + 1);
        setCurrentAnswer(testStore.answers[selectedQuestion] || [undefined]);
    };

    const prevQuestion = () => {
        save();
        setSelectedQuestion(selectedQuestion - 1);
        setCurrentAnswer(testStore.answers[selectedQuestion] || [undefined]);
    }


    if (!isLoaded) {
        console.log("not loaded.")
        return <Spin fullscreen spinning />;
    }

    if (isNotFound) {
        notFound();
    }

    return (
        <>
            {!isTimeUp ?
                <div className={styles.main}>
                    <div id="test-navigation" style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 'var(--gap-half)',
                        position: "sticky",
                        top: "calc(56px + var(--gap))",
                        background: 'var(--foreground)',
                        borderRadius: 8,
                        padding: "12px 16px",
                        maxWidth: "300px",
                        wordWrap: "break-word",
                    }}>
                        <h2>Навігація по тесту</h2>
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            marginBottom: 10,
                            gap: 'var(--gap-half)',
                            flexWrap: "wrap",
                        }}>
                            {questions.map((question, i) =>
                                <Button
                                    key={i}
                                    type={selectedQuestion == i ? "primary" : "default"}
                                    block
                                    onClick={() => setSelectedQuestion(i)}
                                    style={{
                                        width: 30,
                                        height: 40,
                                        padding: 0,
                                        borderRadius: 4,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        fontSize: 16,
                                    }}
                                >
                                    {i + 1}
                                </Button>)}
                        </div>
                    </div>

                    <div className={styles.content}>
                        <div className={styles.content_inner}>
                            <div className={styles.upRight}>
                                <Timer timeEnd={timeEnd} setIsTimeUp={setIsTimeUp} />
                            </div>

                            <h3 style={{marginBottom: 5, color: "rgb(200,200,200)"}}>Питання
                                №{selectedQuestion + 1}</h3>

                            <Question question={questions[selectedQuestion]}
                                      index={selectedQuestion}/>

                            <div className={styles.buttons}>
                                <Button onClick={prevQuestion}
                                        disabled={selectedQuestion == 0} style={{display: "block"}} type="primary">Попереднє
                                    питання</Button>
                                <Button onClick={nextQuestion}
                                        disabled={selectedQuestion == questions.length - 1} style={{display: "block"}}
                                        type="primary">Наступне питання</Button>
                            </div>

                            {(selectedQuestion == questions.length - 1) &&
                                <>
                                    <Button onClick={showModal}
                                            style={{display: "block", margin: "auto", marginTop: 20}}
                                            type="primary"
                                    >
                                        Закінчити спробу
                                    </Button>

                                    <Modal title="Підтвердження" open={isModalVisible} onOk={handleOk}
                                           onCancel={hideModal}>
                                        <p>Ви впевнені?</p>
                                    </Modal>
                                </>
                            }
                        </div>
                    </div>
                </div>
                :
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column",
                    gap: "var(--gap)"
                }}>
                    <h1>Час вийшов</h1>
                    <p>Відповіді, які ви встигли обрати були передані вчителю. Слідкуйте за почтовою скриньою!</p>
                </div>
            }
            {modalCtx}
        </>
    )
}