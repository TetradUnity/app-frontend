'use client';

import {IResponse, TestsNamespace} from "@/types/api.types";
import { Button, Checkbox, Input, Modal, Radio, Space, Spin } from "antd";
import { notFound, useParams } from "next/navigation";

import styles from "./passtest.module.css";
import React, {useEffect, useState} from "react";
import Tiptap from "@/components/Tiptap";

import { ClockCircleOutlined } from "@ant-design/icons";
import { formatTimeInSeconds2 } from "@/utils/TimeUtils";
import { useTestStore } from "@/stores/testStore";
import { AnnouncedSubjectService } from "@/services/announced_subject.service";

import translateRequestError from "@/utils/ErrorUtils";
import { pluralize } from "@/utils/InternalizationUtils";
import { EducationService } from "@/services/education.service";
import { useDeviceStore } from "@/stores/deviceStore";

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

            {question.type == "MULTI_ANSWER" &&
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

    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        let id = setInterval(() => {
            setSecondsLeft(Math.max(timeEnd - Date.now(), 0) / 1000);
            
            if (Date.now() > timeEnd) {
                setIsTimeUp(true);
                clearInterval(id);
            }
        }, 100);

        return () => clearInterval(id);
    }, []);

    return (
       (secondsLeft < 8 * 3600)
            ? <div className={styles.clock}>
                <ClockCircleOutlined style={{color: "#349feb"}}/>
                <p>{formatTimeInSeconds2(secondsLeft)}</p>
            </div>
            : undefined
    )
}

type Props = {
    isEducation: boolean
}
export default function PassTestPage({isEducation} : Props) {
    const params = useParams();
    let testUID = isEducation ? params.id : params.slug;

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

    const deviceType = useDeviceStore(state => state.type);

    const fetch = () => {
        type Response = {
            data: TestsNamespace.ProdTest,
            savedAnswers?: TestsNamespace.AnswerType[];
            time_end: number;
        };
        const proc = (res: Response) => {
            let questions = res.data;

            if (Date.now() > res.time_end) {
                setIsTimeUp(true);
                setIsLoaded(true);
                return;
            }

            testStore.setTotalQuestions(questions.length);
            setQuestions(questions);
            setTimeEnd(res.time_end);

            if (res.savedAnswers) {
                testStore.setAnswers(res.savedAnswers);
            }
            
            setIsLoaded(true);
        }

        if (isEducation) {
            EducationService.startTest(parseInt(testUID as string)).then(response => {
                if (!(response.data && response.time_end)) {
                    setIsLoaded(true);
                    setNotFound(true);
                    return;
                }

                proc({
                    data: response.data,
                    savedAnswers: response.savedAnswers,
                    time_end: response.time_end
                });
            });
        } else {
            AnnouncedSubjectService.startExam(testUID as string).then(response => {
                if (!(response.data && response.time_end)) {
                    setIsLoaded(true);
                    setNotFound(true);
                    return;
                }

                proc({
                    data: response.data,
                    savedAnswers: response.savedAnswers,
                    time_end: response.time_end
                });
            });
        }
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
       if (isEducation) {
        EducationService.sendHomework(parseInt(testUID as string), testStore.getAnswers()).then(resp => {
            if (!resp.success) {
                modal.error({
                    title: "Помилка",
                    content: <p>Закінчити тест не вдалося: {translateRequestError(resp.error_code)}</p>
                })
                return;
            }
            
            const result = resp.result as number;
            const isPassed = result > 0;

            modal[isPassed ? "success" : "error"]({
                title: isPassed ? "Успіх" : "Невдача",
                content:
                    <p>
                        Ви набрали {pluralize(Math.round(result), ["бал", "бала", "балів"])}.
                    </p>,
                onOk: () => window.location.href = "/subject/" + params.slug + "/",
                onCancel: () => window.location.href = "/subject/" + params.slug + "/"
            })
        })
       } else {
            AnnouncedSubjectService.finishExam(testUID as string, testStore.getAnswers()).then(resp => {
                if (!resp.success) {
                    modal.error({
                        title: "Помилка",
                        content: <p>Закінчити екзамен не вдалося: {translateRequestError(resp.error_code)}</p>
                    })
                    return;
                }

                const result = resp.result as number;
                const passing_grade = resp.passing_grade as number;
                const isPassed = result >= passing_grade;

                modal[isPassed ? "success" : "error"]({
                    title: isPassed ? "Успіх" : "Невдача",
                    content:
                        <p>
                            Ви набрали {pluralize(Math.round(result), ["бал", "бала", "балів"])} (прохідний бал: {resp.passing_grade}).
                            {isPassed
                                ? " Ви успішно склали екзамен! Відповіді будуть надіслані вчителю. Слідкуйте за повідомленнями у своїй скриньці!"
                                : " На жаль, ви не склали екзамен. Однак, ви можете спробувати інші наші курси!"}
                        </p>,
                    onOk: () => window.location.href = "/subjects",
                    onCancel: () => window.location.href = "/subjects"
                })
            })
       }
    }

    useEffect(() => {
        fetch();
    }, []);

    const save = async () => {
        if (currentAnswer == testStore.answers[selectedQuestion]) {
            return;
        }

        const proc = (resp: IResponse) => {
            if (!resp.success) {
                modal.error({
                    title: "Помилка під час збереження",
                    content: <p>Під час збереження відповіді трапилася помилка: {translateRequestError(resp.error_code)}</p>
                })
            }
        }

        if (isEducation) {
            EducationService.updateAnswersTest(parseInt(testUID as string), testStore.getAnswers()).then(proc);
        } else {
            AnnouncedSubjectService.updateAnswers(testUID as string, testStore.getAnswers()).then(proc);
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
                    <div className={styles.nav} id="test-navigation" style={{
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
                                    type={
                                        selectedQuestion == i
                                        ? "primary"
                                        : (
                                            (testStore.answers[i] && testStore.answers[i]?.length)
                                            ? "default"
                                            : "dashed"
                                        )
                                    }
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
                                        disabled={selectedQuestion == 0}
                                        style={{display: "block"}} type="primary"
                                    >
                                            {deviceType == "mobile" ? "<" : "Попереднє питання"}
                                        </Button>

                                <Button onClick={nextQuestion}
                                        disabled={selectedQuestion == questions.length - 1}
                                        style={{display: "block"}}
                                        type="primary"
                                    >
                                        {deviceType == "mobile" ? ">" : "Наступне питання"}
                                    </Button>
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
                    <h1>Час вичерпано</h1>
                    {isEducation
                        ? <p>Відповіді, які ви встигли вибрати, були передані вчителю.</p>
                        : <p>Відповіді, які ви встигли вибрати, були передані вчителю. Слідкуйте за повідомленнями у поштовій скриньці!</p>
                    }
                </div>
            }
            {modalCtx}
        </>
    )
}