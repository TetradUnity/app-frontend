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

import { SaveFilled } from "@ant-design/icons";

import { motion } from "framer-motion";

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
    if (!question) {
        return null;
    }

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

const Timer = ({timeEnd}: {timeEnd: number | undefined}) => {
    if (!timeEnd) {
        return null;
    }

    const [_, setForce] = useState(false);

    useEffect(() => {
        let id = setInterval(() => {
            setForce(v => !v);
        }, 1000);

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

    const testStore = useTestStore();

    const fetch = (uid: string | string[]) => {
        AnnouncedSubjectService.startExam(uid as string).then(res => {
            if (!res.data) {
                setIsLoaded(true);
                setNotFound(true);
                return;
            }
            
            let testInfo = res.data;

            setQuestions(testInfo);
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
        alert(JSON.stringify(testStore.answers));
        // TODO next router push to result page
    }

    useEffect(() => {

        fetch(testUID);
        setIsLoaded(true);
    }, []);

    const save = () => {
        if (currentAnswer == testStore.answers[selectedQuestion]) {
            return;
        }

        
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
                                <Timer timeEnd={timeEnd} />
                                
                                {/* <motion.span animate={{width: 30}}>
                                    <SaveFilled style={{fontSize: 30, color: "#77a2e6"}} />
                                </motion.span> */}
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

                                    <Modal title="Confirm Submission" visible={isModalVisible} onOk={handleOk}
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
                    <p>Відповіді, які ви обрали були передани. Очікуйте лист який прийде до вашої скринькі коли почнеться предмет.</p>
                </div>
            }
        </>
    )
}