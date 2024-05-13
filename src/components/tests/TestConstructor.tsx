import { Button, Checkbox, Input, Modal, Select } from "antd";
import {PlusCircleFilled, CloseCircleOutlined} from "@ant-design/icons";

import styles from "./styles.module.css";
import TextArea from "antd/es/input/TextArea";
import { Dispatch, SetStateAction, useEffect, useReducer, useState } from "react";
import { HookAPI } from "antd/es/modal/useModal";

function Answer({deleteAnswer, item, type, answers, forceUpdate, setAnswers} : {deleteAnswer: (answer: Answer) => void, item: Answer, type: Question["type"], answers: Answer[], forceUpdate: () => void, setAnswers: Dispatch<SetStateAction<Answer[]>>}) {
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
                options={[
                    {value: "text", label: "Текст"},
                    {value: "image", label: "Картинка"},
                ]}
                onChange={(value: Answer["type"]) => {
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

function TextAnswer({deleteAnswer, item} : {deleteAnswer: (answer: Answer) => void, item: Answer}) {
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
    )
}

function Question({item,questions,setQuestions,modal} : {item: Question, questions: Question[], setQuestions: Dispatch<SetStateAction<Question[]>>, modal: HookAPI}) {
    const [type, setType] = useState<Question["type"]>("one_answer");
    const [answers, setAnswers] = useState<Answer[]>([]);

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

    const deleteAnswer = (answer: Answer) => {
        setAnswers(answers.filter(item => item !== answer));
    };

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
                    onChange={(type: Question["type"]) => {
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

type Answer = {
    isCorrect: boolean,
    type: "text" | "image",
    content: string
};

type Question = {
    title: string,
    type: "one_answer" | "multiply_answer" | "text",
    answers: Answer[]
};

export function TestConstructor() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [modal, modalCtxHolder] = Modal.useModal();

    const createNewQuestion = () => {
        setQuestions([...questions, {
            title: "",
            type: "one_answer",
            answers: []
        }]);
    }

    return (
        <div className={styles.main_div}>
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
}