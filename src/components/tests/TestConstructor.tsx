import { Button, Checkbox, Divider, Input, Modal, Select, TimePicker } from "antd";
import { PlusCircleFilled, CloseCircleOutlined, UpCircleOutlined, DownCircleOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";
import TextArea from "antd/es/input/TextArea";
import React, { Dispatch, SetStateAction, Suspense, useEffect, useImperativeHandle, useReducer, useState } from "react";
import { HookAPI } from "antd/es/modal/useModal";

import { TestsNamespace } from "@/types/api.types";
import Tiptap, { TiptapRef } from "../Tiptap";
import ImageUploadModal from "../ImageUploadModal";
import { moveElementInArray, moveElementLeftInArray, moveElementRightInArray } from "@/utils/ArrayUtils";
import countWordsInHtmlString from "@/utils/StringUtils";

type AnswerRef = {
    getData: () => TestsNamespace.Answer,
    uncheck: () => void
};

const Answer = React.forwardRef((
    {deleteAnswer, uncheckAllAnswers, orderAnswer, openImageUploadModal}:
    {deleteAnswer: () => void, uncheckAllAnswers: () => void, orderAnswer: (up: boolean) => void, openImageUploadModal: (cb: (url: string) => void) => void}, ref) => {
    const [isCorrect, setIsCorrect] = useState(false);
    const editorRef = React.createRef<TiptapRef>();

    useImperativeHandle(ref, () => ({
        getData: () => ({
            isCorrect: isCorrect,
            content: editorRef.current?.getEditor()?.getHTML()
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

            
            <Tiptap
                className="ant-input ant-input-outlined"
                style={{flex: 1}}
                ref={editorRef}
                openImageUploadModal={openImageUploadModal}
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
    {index, modal, deleteQuestion, orderQuestion, openImageUploadModal} :
    {index: number, modal: HookAPI, deleteQuestion: () => void, orderQuestion: (up: boolean) => void, openImageUploadModal: (cb: (url: string) => void) => void},
ref) => {
    const questionTitleEditorRef = React.useRef<TiptapRef>();
    const [type, setType] = useState<TestsNamespace.Question["type"]>("ONE_ANSWER");

    type answer = {
        id: number,
        ref: React.RefObject<AnswerRef>,
    };

    const [answers, setAnswers] = useState<answer[]>([]);
    const [answersCount, setAnswersCount] = useState(0);

    useImperativeHandle(ref, () => ({
        getData: () => ({
            title: questionTitleEditorRef.current?.getEditor()?.getHTML(),
            type: type,
            answers: answers.map(item => item.ref.current?.getData()),
        })
    } as QuestionRef));

    const changeQuestionType = (newType: TestsNamespace.Question["type"]) => {
        if (
            (answers.length > 0) && (
            (type == "ONE_ANSWER" && newType == "TEXT") ||
            (type == "MULTY_ANSWER" && newType == "TEXT") ||
            (type == "TEXT" && newType == "ONE_ANSWER") ||
            (type == "TEXT" && newType == "MULTY_ANSWER") )
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

        if ((type == "MULTY_ANSWER" && newType == "ONE_ANSWER")) {
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
        let index = answers.findIndex(item => item === answer);

        if (up) 
            setAnswers(moveElementLeftInArray(answers, index));
        else 
            setAnswers(moveElementRightInArray(answers, index));
    }

    return (
        <div className={styles.question}>
            <div className={styles.question_order_buttons}>
                <Button onClick={() => orderQuestion(true)} type="dashed" shape="circle" icon={<UpCircleOutlined />} />
                <Button onClick={() => orderQuestion(false)} type="dashed" shape="circle" icon={<DownCircleOutlined />} />
            </div>

            <section>
                <h3>Питання №{index+1}:</h3>
                <Tiptap
                    ref={questionTitleEditorRef}
                    className="ant-input ant-input-outlined"
                    style={{minHeight: 30}}
                    openImageUploadModal={openImageUploadModal}
                />
            </section>

            <section>
                <h3>Тип питання:</h3>
                <Select
                    value={type}
                    onChange={changeQuestionType}
                    options={[
                        {value: "ONE_ANSWER", label: "Одна правильна відповідь"},
                        {value: "MULTY_ANSWER", label: "Декілька правильних відповідей"},
                        {value: "TEXT", label: "Текст"}
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
                            openImageUploadModal={openImageUploadModal}
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
    getData: () => TestsNamespace.Test[] | null;
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
    const [passingGrade, setPassingGrade] = useState(70);

    const err = (ind: number, str: string) => {
        modal.error({
            title: "Помилка.",
            maskClosable: true,
            content: <p>В запитанні №{ind+1}: {str}</p>
        })
    };

    const checkIfCorrectly = (data: (TestsNamespace.Question | undefined)[]) => {
        if (passingGrade < 0) {
            modal.error({
                title: "Помилка.",
                maskClosable: true,
                content: <p>Прохідний бал не може бути меньшим за 0.</p>
            })
            return false;
        }

        let question;
        for (let i = 0; i < data.length; i++)  {
            question = data[i];
            
            if (question === undefined) {
                err(i, "Щось пішло не так.");
                return false;
            }

            question.title = question.title.trim();
            if (countWordsInHtmlString(question.title) == 0) {
                err(i, "Заговолок запитання не може бути порожнім!");
                return false;
            }

            if (question.type != "TEXT") {
                if (question.answers.length < 2) {
                    err(i, "К-сть відповідей не може бути меншою за 2.");
                    return false;
                }
                let isOneCorrect = false;
                for (let j = 0; j < question.answers.length; j++) {
                    question.answers[j].content = question.answers[j].content.trim();
                    if (countWordsInHtmlString(question.answers[j].content) == 0) {
                        err(i, "У відповіді №"+(j+1)+": Відповідь не може бути пустою.");
                        return false;
                    }
                    if (question.answers[j].isCorrect) {
                        isOneCorrect = true;
                    }
                }
                if (!isOneCorrect) {
                    err(i, "Принаймі одна відповідь повина бути правильною.");
                    return false;
                }
            }

            if (question.type == "TEXT") {
                if (question.answers.length < 1) {
                    err(i, "Повина існувати принаймі хоча б одна відповідь.");
                    return false;
                }

                for (let j = 0; j < question.answers.length; j++) {
                    question.answers[j].content = question.answers[j].content.trim();
                    if (countWordsInHtmlString(question.answers[j].content) == 0) {
                        err(i, "У відповіді №"+(j+1)+": Відповідь не може бути пустою.");
                        return false;
                    }
                }
            }

            if (question.answers.length > 5) {
                err(i, "В питанні може існувати не більше 5-ти відповідей.");
                return false;
            }
        }

        return true;
    }

    useImperativeHandle(ref, () => ({
        getData: () => {
            let data = questions.map(item => item.ref.current?.getData());
            if (!checkIfCorrectly(data)) {
                return null;
            }

            return [
                {
                    time: testDuration,
                    passing_grade: passingGrade
                },
                ...data
            ];
        } 
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

    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploadModalCallback, setUploadModalCallback] = useState<(url: string) => void>(() => {});
    const openImageUploadModal = (callback: (url: string) => void) => {
        setUploadModalCallback(() => callback);
        setUploadModalOpen(true);
    }

    const orderQuestion = (question: question, up: boolean) => {
        let index = questions.findIndex(item => item === question);

        if (up) 
            setQuestions(moveElementLeftInArray(questions, index));
        else 
            setQuestions(moveElementRightInArray(questions, index));
    }

    return (
        <div className={styles.main_div}>
            <ImageUploadModal
                open={uploadModalOpen}
                setOpen={setUploadModalOpen}
                callback={uploadModalCallback}
            />

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

            <section>
                <h2 style={{marginBottom: 10}}>Прохідний бал:</h2>
                <Input
                    value={passingGrade}
                    onChange={val => setPassingGrade(parseInt(val.target.value))}
                    type="number"
                />
            </section>

            <Divider orientationMargin={30} orientation="right" dashed>Питання</Divider>
            
            <p>В заголовках запитання, або в текстових відповідях можна форматувати текст, або додавати математичні формули. Подробніше за цим посиланням <a href="/faq/text_formatting">тут.</a></p>
            {questions.map((item,i) => 
                <Question
                    key={item.id}
                    index={i}
                    ref={item.ref}
                    deleteQuestion={deleteQuestion.bind(null, item)}
                    orderQuestion={orderQuestion.bind(null, item)}
                    modal={modal}
                    openImageUploadModal={openImageUploadModal}
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