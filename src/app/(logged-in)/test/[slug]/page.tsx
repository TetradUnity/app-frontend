'use client';

import {TestsNamespace} from "@/types/api.types";
import {Button, Checkbox, Input, Modal, Radio, Space} from "antd";
import {useParams} from "next/navigation";

import styles from "./styles.module.css";
import React, {useEffect, useImperativeHandle, useState} from "react";
import Tiptap from "@/components/Tiptap";
import countWordsInHtmlString from "@/utils/StringUtils";

import {ClockCircleOutlined} from "@ant-design/icons";
import {formatTimeInSeconds2} from "@/utils/TimeUtils";
import {useTestStore} from "@/stores/testStore";
import {SubjectService, filtersType} from "@/services/subject.service";

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
        title: "<p>Які з перелічених явищ є <b>хімічними</b>?</p>",
        type: "MULTI_ANSWER",
        answers: [
            {content: "<p>гроза</p>"},
            {content: "<p>реакція</p>"},
            {content: "<p>вибух</p>"},
            {content: "<p>райдуга</p>"},
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
        answers: [],
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
        title: "<p>формула для обчислення роботи</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>W = F * S</p>"},
            {content: "<p>W = F / S</p>"},
            {content: "<p>W = F + S</p>"},
            {content: "<p>W = F - S</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Using Thread.sleep() method is.</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    },
    {
        title: "<p>Що таке робота?</p>",
        type: "ONE_ANSWER",
        answers: [
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
            {content: "<p>фізична величина</p>"},
            {content: "<p>механічна величина</p>"},
        ],
    }
]

type QuestionRenderParams = {
    question: TestsNamespace.ProdQuestion,
    index: number
}
type AnswerRenderRef = {
    getData: () => number | number[] | string | null
}

const OneAnswerRender = React.forwardRef(({question, index}: QuestionRenderParams, ref) => {
    const value = useTestStore(state => state.answers[index]);
    const setValue = useTestStore(state => state.setAnswer.bind(null, index));

    useImperativeHandle(ref, () => ({
        getData: () => value
    } as AnswerRenderRef));

    return (
        <Radio.Group value={value} onChange={val => setValue(val.target.value)}>
            <Space direction="vertical">
                {question.answers.map((answer, i) =>
                    <Radio key={i} value={i}>
                        <Tiptap editable={false} content={answer.content}/>
                    </Radio>
                )}
            </Space>
        </Radio.Group>
    )
})

const MultiAnswersRender = React.forwardRef(({question, index}: QuestionRenderParams, ref) => {
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
                question.answers.map((answer, i) => ({
                    label: <Tiptap editable={false} content={answer.content}/>,
                    value: i
                }))
            }
        />
    )
});

const TextAnswerRender = React.forwardRef(({question, index}: QuestionRenderParams, ref) => {
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

const Question = React.forwardRef(({question, index}: QuestionRenderParams, ref) => {
    const answerRef = React.useRef<AnswerRenderRef>();

    useImperativeHandle(ref, () => ({
        getData: () => answerRef.current?.getData()
    } as AnswerRenderRef));

    return (
        <>
            <Tiptap style={{marginBottom: 10, fontSize: (countWordsInHtmlString(question.title) > 7) ? 23 : 30}}
                    editable={false} content={question.title}/>

            {question.type == "ONE_ANSWER" &&
                <OneAnswerRender ref={answerRef} question={question} index={index}/>
            }

            {question.type == "MULTI_ANSWER" &&
                <MultiAnswersRender ref={answerRef} question={question} index={index}/>
            }

            {question.type == "TEXT" &&
                <TextAnswerRender ref={answerRef} question={question} index={index}/>
            }
        </>
    )
});

export default function TestPage() {
    const params = useParams();
    let {slug: testUID} = params;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isTimeUp, setIsTimeUp] = useState(false);

    const [testInfo, setTestInfo] = useState<TestsNamespace.ProdTest["0"]>();
    const [questions, setQuestions] = useState<TestsNamespace.ProdQuestion[]>([]);

    const [selectedQuestion, setSelectedQuestion] = useState(0);

    const [isLoaded, setIsLoaded] = useState(false);

    const questionRef = React.useRef<AnswerRenderRef>();
    const testStore = useTestStore();

    const fetch = (uid: string | string[]) => {
        // SubjectService.startExam(uid).then(res => {
        //     alert(JSON.stringify(res));
        //     if (!res.success) {
        //         // @ts-ignore
        //         setQuestions([{title: "Помилка завантаження тесту", type: "ONE_ANSWER", answers: []}]);
        //         setTestInfo({time: -1});
        //         return;
        //     }
        //
        //     // @ts-ignore
        //     setQuestions(res.filter((_, i) => i > 0) as TestsNamespace.ProdQuestion[]);
        //     // @ts-ignore
        //     setTestInfo(res[0]);
        //     alert(JSON.stringify(res));
        //     // @ts-ignore
        // })
        setQuestions(MOCK_TEST_INFO.filter((_, i) => i > 0) as TestsNamespace.ProdQuestion[]);
        setTestInfo(MOCK_TEST_INFO[0]);
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

    const timerStart = () => {
        const interval = setInterval(() => {
            setTestInfo(prev => {
                if (prev.time == 0) {
                    clearInterval(interval);
                    setIsTimeUp(true);
                    return prev;
                }

                return {
                    time: prev.time - 1
                }
            })
        }, 1000);
    }
    useEffect(() => {
        fetch(testUID);
        setIsLoaded(true);
        timerStart()
    }, []);
    if (!isLoaded) {
        return;
    }

    if (!testInfo) {
        return;
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
                            <div className={styles.clock}>
                                <ClockCircleOutlined style={{color: "#349feb"}}/>
                                <p>{formatTimeInSeconds2(testInfo.time)}</p>
                            </div>

                            <h3 style={{marginBottom: 5, color: "rgb(200,200,200)"}}>Питання
                                №{selectedQuestion + 1}</h3>

                            <Question ref={questionRef} question={questions[selectedQuestion]}
                                      index={selectedQuestion}/>

                            <div className={styles.buttons}>
                                <Button onClick={() => setSelectedQuestion(selectedQuestion - 1)}
                                        disabled={selectedQuestion == 0} style={{display: "block"}} type="primary">Попереднє
                                    питання</Button>
                                <Button onClick={() => setSelectedQuestion(selectedQuestion + 1)}
                                        disabled={selectedQuestion == questions.length - 1} style={{display: "block"}}
                                        type="primary">Наступне питання</Button>
                            </div>

                            {(selectedQuestion == questions.length - 1) &&
                                <>
                                    <Button onClick={showModal}
                                            style={{display: "block", margin: "auto", marginTop: 20}}
                                            type="primary">Закінчити спробу
                                    </Button>

                                    <Modal title="Confirm Submission" visible={isModalVisible} onOk={handleOk}
                                           onCancel={hideModal}>
                                        <p>Are you sure you want to submit?</p>
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
                    <Button onClick={submit} type="primary">Завершити тест</Button>
                </div>
            }
        </>
    )
}