import { Button, Checkbox, Divider, Input, Modal, Select, TimePicker } from "antd";
import {PlusCircleFilled, CloseCircleOutlined} from "@ant-design/icons";

import styles from "./styles.module.css";
import TextArea from "antd/es/input/TextArea";
import React, { Dispatch, SetStateAction, useEffect, useImperativeHandle, useReducer, useState } from "react";
import { HookAPI } from "antd/es/modal/useModal";

import { TestsNamespace } from "@/types/api.types";

function Answer({deleteAnswer, item, type, answers, forceUpdate, setAnswers} : {deleteAnswer: (answer: TestsNamespace.Answer) => void, item: TestsNamespace.Answer, type: TestsNamespace.Question["type"], answers: TestsNamespace.Answer[], forceUpdate: () => void, setAnswers: Dispatch<SetStateAction<TestsNamespace.Answer[]>>}) {
    const [content, setContent] = useState("");
    
    return (
        <div className={styles.answer}>
            <h4>Вірна відповідь:</h4>
            <Checkbox
                checked={item.isCorrect}
                onChange={e => {
                    if (type == "one_answer") {
                        for (let i = 0; i < answers.length; i++) {
                            answers[i].isCorrect = false;
                        }
                    }
                    item.isCorrect = !item.isCorrect;
                    setAnswers(answers);
                    forceUpdate();
                }}
            />

            <h4>Тип:</h4>
            <Select
                defaultValue="text"
                style={{maxWidth: 100}}
                options={[
                    {value: "text", label: "Текст"},
                    {value: "image", label: "Картинка"},
                ]}
                onChange={(value: TestsNamespace.Answer["type"]) => {
                    item.type = value;
                    setContent("");
                    item.content = "";
                }}
            />

            <h4>Текст:</h4>
            <Input
                value={content}
                onChange={e => {
                    setContent(e.target.value);
                    item.content = content;
                }}
            />

            <Button
                onClick={() => deleteAnswer(item)}
                danger
                shape="circle"
                type="text"
                icon={<CloseCircleOutlined />}
            />
        </div>
    )
}

function TextAnswer({deleteAnswer, item} : {deleteAnswer: (answer: TestsNamespace.Answer) => void, item: TestsNamespace.Answer}) {
    return (
        <div className={styles.answer}>
            <Input />
            <Button
                onClick={() => deleteAnswer(item)}
                danger
                shape="circle"
                type="text"
                icon={<CloseCircleOutlined />}
            />
        </div>
    );
}

function Question({item,questions,setQuestions,modal} : {item: TestsNamespace.Question, questions: TestsNamespace.Question[], setQuestions: Dispatch<SetStateAction<TestsNamespace.Question[]>>, modal: HookAPI}) {
    const [type, setType] = useState<TestsNamespace.Question["type"]>("one_answer");
    const [answers, setAnswers] = useState<TestsNamespace.Answer[]>([]);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const deleteQuestion = () => {
        const m = modal.confirm({
            title: "Видалення питання",
            content: "Ви впевнені в цему?",
            okText: "Видалити",
            cancelText: "Ні.",
            onOk: () => {
                setQuestions(questions.filter(question => question !== item));
            }
        })
    };

    const createAnswer = () => {
        setAnswers([...answers, {
            content: "",
            type: "text",
            isCorrect: (type == "text") || (answers.length == 0)
        }]);
    };

    const deleteAnswer = (answer: TestsNamespace.Answer) => {
        setAnswers(answers.filter(item => item !== answer));
    };

    useEffect(() => {
        setQuestions(questions.map(obj => {
            if (obj != item) {
                return obj;
            }
            return {...item, answers: answers}
        }))
    }, [answers]);

    return (
        <div className={styles.question}>
            <section>
                <h3>Питання:</h3>
                <TextArea
                    onChange={e => item.title = e.currentTarget.value}
                />
            </section>

            <section>
                <h3>Тип питання:</h3>
                <Select
                    value={type}
                    onChange={(type: TestsNamespace.Question["type"]) => {
                        if (
                            (answers.length > 0) && (
                            (item.type == "one_answer" && type == "text") ||
                            (item.type == "multiply_answer" && type == "text") ||
                            (item.type == "text" && type == "one_answer") ||
                            (item.type == "text" && type == "multiply_answer") )
                        ) {
                            const m = modal.confirm({
                                title: "Попередження",
                                content: "Якщо ви змінюєте тип з одної/кількох відповідей на текст (чи навпаки), існуючі варіанти відповідей на даний момент зникнуть.",
                                okText: "Продовжити",
                                cancelText: "Відмінити",
                                closable: false,
                                maskClosable: false,

                                onOk: () => {
                                    item.type = type;
                                    setType(type);
                                    setAnswers([]);
                                    m.destroy();
                                },
                                onCancel: () => {
                                    m.destroy();
                                }
                            });
                        }

                        if ((item.type == "multiply_answer" && type == "one_answer")) {
                            for (let i = 0; i < answers.length; i++) {
                                answers[i].isCorrect = i == 0;
                            }
                        }

                        item.type = type;
                        setType(type);
                    }}
                    options={[
                        {value: "one_answer", label: "Одна правильна відповідь"},
                        {value: "multiply_answer", label: "Декілька правильних відповідей"},
                        {value: "text", label: "Текст"}
                    ]}
                />
            </section>

            <section>
                <h3>Варіанти відповідей:</h3>
                {(type == "text") && <p style={{marginBottom: 10}}>Під час перевірки відповіді нижній та верхній регістр не враховується.</p>}
                <div className={styles.answers_div}>
                    {
                        (type != "text")
                        ? answers.map((item, i) => <Answer key={i} setAnswers={setAnswers} forceUpdate={forceUpdate} type={type} answers={answers} deleteAnswer={deleteAnswer} item={item} />)
                        : answers.map((item, i) => <TextAnswer key={i} deleteAnswer={deleteAnswer} item={item} />)
                    }
                    <div className={styles.center_btn}>
                        <Button onClick={createAnswer} size="large" type="dashed" shape="circle" icon={<PlusCircleFilled />} />
                    </div>
                </div>
            </section>

            <Button onClick={deleteQuestion} type="primary" danger block>Видалити</Button>
        </div>
    )
}

export type TestConstructorRef = {
    getData: () => TestsNamespace.Test[]
}

export const TestConstructor = React.forwardRef((props, ref) => {
    const [questions, setQuestions] = useState<TestsNamespace.Question[]>([]);
    const [modal, modalCtxHolder] = Modal.useModal();

    const [testDuration, setTestDuration] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
        getData: () => ([
            {
                time: testDuration
            },
            ...questions
        ]) as TestsNamespace.Test
    }));

    const createNewQuestion = () => {
        setQuestions([...questions, {
            title: "",
            type: "one_answer",
            answers: []
        }]);
    };

    return (
        <div className={styles.main_div}>
            <Divider orientationMargin={30} orientation="right" dashed>Загальна інформація</Divider>
            <section>
                <h2 style={{marginBottom: 10}}>Тривалість тесту:</h2>
                <TimePicker
                    onChange={e => {
                        if (!e) {
                            setTestDuration(null);
                            return;
                        }
                        setTestDuration(e.unix() * 1000)
                    }}
                    showNow={false}
                />
            </section>

            <Divider orientationMargin={30} orientation="right" dashed>Питання</Divider>
            {questions.map((question,i) =>
            <Question
                key={i}
                item={question}
                questions={questions}
                setQuestions={setQuestions}
                modal={modal}
            />)}
            
            <Button
                block
                icon={<PlusCircleFilled />}
                type="dashed"
                onClick={createNewQuestion}
            >Нове запитання</Button>

            {modalCtxHolder}
        </div>
    )
})