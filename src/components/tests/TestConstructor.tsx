import { Button, Checkbox, Divider, Input, Modal, Select, TimePicker } from "antd";
import { PlusCircleFilled, CloseCircleOutlined, UpCircleOutlined, DownCircleOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";
import TextArea from "antd/es/input/TextArea";
import React, { Dispatch, SetStateAction, Suspense, useEffect, useImperativeHandle, useReducer, useState } from "react";
import { HookAPI } from "antd/es/modal/useModal";

import { TestsNamespace } from "@/types/api.types";
import { MDXEditor } from "@mdxeditor/editor";
import { EditorComp } from "../mdx/WMDXEditor";

type AnswerRef = {
    getData: () => TestsNamespace.Answer,
    uncheck: () => void
};

const Answer = React.forwardRef((
    {deleteAnswer, uncheckAllAnswers, orderAnswer}:
    {deleteAnswer: () => void, uncheckAllAnswers: () => void, orderAnswer: (up: boolean) => void}, ref) => {
    const [isCorrect, setIsCorrect] = useState(false);
    const [content, setContent] = useState("");
    
    useImperativeHandle(ref, () => ({
        getData: () => ({
            isCorrect: isCorrect,
            content: content
        }),
        uncheck: () => {
            setIsCorrect(false)
        }
    } as AnswerRef));

    return (
        <div className={styles.answer}>
            <h4>Вірна відповідь:</h4>
            <Checkbox
                checked={isCorrect}
                onChange={e => {
                    uncheckAllAnswers();
                    setIsCorrect(!isCorrect);
                }}
                style={{marginRight: 10}}
            />

            <Input
                placeholder="Вміст..."
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            <Button
                danger
                shape="circle"
                type="text"
                icon={<CloseCircleOutlined />}
                onClick={deleteAnswer}
            />

            <div>
                <Button onClick={() => orderAnswer(true)} type="dashed" shape="circle" icon={<UpCircleOutlined />} />
                <Button onClick={() => orderAnswer(false)} type="dashed" shape="circle" icon={<DownCircleOutlined />} />
            </div>
        </div>
    )
})

const TextAnswer = React.forwardRef((
    {deleteAnswer, orderAnswer}:
    {deleteAnswer: () => void, orderAnswer: (up: boolean) => void}, ref) => {
    const [content, setContent] = useState("");
    
    useImperativeHandle(ref, () => ({
        getData: () => ({
            isCorrect: true,
            content: content
        }),
        uncheck: () => {}
    } as AnswerRef));

    return (
        <div className={styles.answer}>
            <Input
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            <Button
                onClick={deleteAnswer}
                danger
                shape="circle"
                type="text"
                icon={<CloseCircleOutlined />}
            />

            <div>
                <Button onClick={() => orderAnswer(true)} type="dashed" shape="circle" icon={<UpCircleOutlined />} />
                <Button onClick={() => orderAnswer(false)} type="dashed" shape="circle" icon={<DownCircleOutlined />} />
            </div>
        </div>
    )
})

type QuestionRef = {
    getData: () => TestsNamespace.Question
};

const Question = React.forwardRef((
    {modal, deleteQuestion, orderQuestion} :
    {modal: HookAPI, deleteQuestion: () => void, orderQuestion: (up: boolean) => void},
ref) => {
    const [title, setTitle] = useState("");
    const [type, setType] = useState<TestsNamespace.Question["type"]>("ONE_ANSWER");
    const [contentType, setContentType] = useState("text");

    type answer = {
        id: number,
        ref: React.RefObject<AnswerRef>,
    };

    const [answers, setAnswers] = useState<answer[]>([]);
    const [answersCount, setAnswersCount] = useState(0);

    useImperativeHandle(ref, () => ({
        getData: () => ({
            title:title,
            type: type,
            answers: answers.map(item => item.ref.current?.getData()),
        })
    } as QuestionRef));

    const changeQuestionType = (newType: TestsNamespace.Question["type"]) => {
        if (
            (answers.length > 0) && (
            (type == "ONE_ANSWER" && newType == "TEXT") ||
            (type == "MULTI_ANSWER" && newType == "TEXT") ||
            (type == "TEXT" && newType == "ONE_ANSWER") ||
            (type == "TEXT" && newType == "MULTI_ANSWER") )
        ) {
            modal.confirm({
                title: "Попередження",
                content: "Якщо ви змінюєте тип з одної/кількох відповідей на текст (чи навпаки), існуючі варіанти відповідей на даний момент зникнуть.",
                okText: "Продовжити",
                cancelText: "Відмінити",
                closable: false,
                maskClosable: false,

                onOk: () => {
                    setAnswers([]);
                    setType(newType);
                }
            });
            return;
        }

        if ((type == "MULTI_ANSWER" && newType == "ONE_ANSWER")) {
            uncheckAllAnswers(true);
        }

        setType(newType);
    };

    const createAnswer = () => {
        setAnswers([...answers, {
            id: answersCount,
            ref: React.createRef()
        }]);
        setAnswersCount(answersCount + 1);
    };

    const uncheckAllAnswers = (ignore?: boolean) => {
        if ((type != "ONE_ANSWER") && (!ignore)) return;
        answers.forEach(answer => answer.ref.current?.uncheck());
    }

    const deleteAnswer = (answer: answer) => {
        setAnswers(answers.filter(item => item !== answer));
    }

    const orderAnswer = (answer: answer, up: boolean) => {
        // TODO: make it function workly.
    }

    return (
        <div className={styles.question}>
            <div className={styles.question_order_buttons}>
                <Button onClick={() => orderQuestion(true)} type="dashed" shape="circle" icon={<UpCircleOutlined />} />
                <Button onClick={() => orderQuestion(false)} type="dashed" shape="circle" icon={<DownCircleOutlined />} />
            </div>

            <section>
                <h3>Питання:</h3>
                <TextArea
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
            </section>

            <Suspense fallback={null}>
                <EditorComp editorRef={null} markdown="Hello **world!**" />
            </Suspense>

            <section>
                <h3>Тип питання:</h3>
                <Select
                    value={type}
                    onChange={changeQuestionType}
                    options={[
                        {value: "ONE_ANSWER", label: "Одна правильна відповідь"},
                        {value: "MULTI_ANSWER", label: "Декілька правильних відповідей"},
                        {value: "TEXT", label: "Текст"}
                    ]}
                    style={{marginBottom: 10}}
                />

                <h3>Тип вмісту:</h3>
                <Select
                    value={contentType}
                    onChange={type => setContentType(type)}
                    options={[
                        {value: "text", label: "Текст"},
                        {value: "image", label: "Зображення", disabled: true}
                    ]}
                    style={{marginBottom: 10}}
                />
            </section>

            <section>
                <h3>Варіанти відповідей:</h3>
                <div className={styles.answers_div}>
                    {(type == "TEXT") && <p style={{marginBottom: 10}}>Під час перевірки відповіді нижній та верхній регістр не враховується.</p>}
                    
                    {(type != "TEXT") && answers.map(item =>
                        <Answer
                            ref={item.ref}
                            key={item.id}
                            deleteAnswer={deleteAnswer.bind(null, item)}
                            uncheckAllAnswers={uncheckAllAnswers}
                            orderAnswer={orderAnswer.bind(null, item)}
                        />
                    )}
                    {(type == "TEXT") && answers.map(item =>
                        <TextAnswer
                            ref={item.ref}
                            key={item.id}
                            deleteAnswer={deleteAnswer.bind(null, item)}
                            orderAnswer={orderAnswer.bind(null, item)}
                        />
                    )}

                    <div className={styles.center_btn}>
                        <Button onClick={createAnswer} size="large" type="dashed" shape="circle" icon={<PlusCircleFilled />} />
                    </div>
                </div>
            </section>
            
            <Button onClick={deleteQuestion} type="primary" danger block>Видалити</Button>
        </div>
    )
});


export type TestConstructorRef = {
    getData: () => TestsNamespace.Test[]
}

export const TestConstructor = React.forwardRef((props, ref) => {
    type question = {
        id: number,
        ref: React.RefObject<QuestionRef>
    };
    const [questions, setQuestions] = useState<question[]>([]);
    const [questionCount, setQuestionCount] = useState(0);

    const [modal, modalCtxHolder] = Modal.useModal();

    const [testDuration, setTestDuration] = useState<number | null>(null);

    useImperativeHandle(ref, () => ({
        getData: () => ([
            {
                time: testDuration
            },
            ...questions.map(item => item.ref.current?.getData())
        ]) as TestsNamespace.Test
    }));

    const createNewQuestion = () => {
        setQuestions([...questions, {
            id: questionCount,
            ref: React.createRef(),
        }]);
        setQuestionCount(questionCount + 1);
    };

    const deleteQuestion = (question: question) => {
        modal.confirm({
            title: "Видалення питання",
            content: "Ви впевнені в цему?",
            okText: "Видалити",
            cancelText: "Ні.",
            onOk: () => {
                setQuestions(questions.filter(item => item !== question));
            }
        })
    }

    const orderQuestion = (question: question, up: boolean) => {
        // TODO: make it function workly.
    }

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
            
            {questions.map(item => 
                <Question
                    key={item.id}
                    ref={item.ref}
                    deleteQuestion={deleteQuestion.bind(null, item)}
                    orderQuestion={orderQuestion.bind(null, item)}
                    modal={modal}
                />
            )}
            
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