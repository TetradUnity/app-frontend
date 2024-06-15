import { Button, Checkbox, Divider, Input, Modal, Select, TimePicker } from "antd";
import { PlusCircleFilled, CloseCircleOutlined, UpCircleOutlined, DownCircleOutlined, DragOutlined } from "@ant-design/icons";

import styles from "./styles.module.css";
import React, { useImperativeHandle, useState } from "react";
import { HookAPI } from "antd/es/modal/useModal";

import { Drafts, TestsNamespace } from "@/types/api.types";
import Tiptap, { TiptapRef } from "../Tiptap";
import ImageUploadModal from "../modals/ImageUploadModal";
import { moveElementLeftInArray, moveElementRightInArray } from "@/utils/ArrayUtils";
import { countWordsInHtmlString } from "@/utils/StringUtils";
import dayjs, { Dayjs } from "dayjs";
import { DragControls, Reorder, useDragControls } from "framer-motion";
import { dayjsTimeToMs } from "@/utils/OtherUtils";

type AnswerRef = {
    getData: () => TestsNamespace.Answer,
    uncheck: () => void,
    loadFromDraft: (draft: TestsNamespace.Answer) => void
};

const Answer = React.forwardRef(function Answer(
    {deleteAnswer, uncheckAllAnswers, orderAnswer, openImageUploadModal}:
    {deleteAnswer: () => void, uncheckAllAnswers: () => void, orderAnswer: (up: boolean) => void, openImageUploadModal: (cb: (url: string) => void) => void}, ref) {
    const [isCorrect, setIsCorrect] = useState(false);
    const editorRef = React.useRef<TiptapRef>();

    useImperativeHandle(ref, () => ({
        getData: () => ({
            isCorrect: isCorrect,
            content: editorRef.current?.getEditor()?.getHTML()
        }),
        uncheck: () => {
            setIsCorrect(false)
        },
        loadFromDraft: (draft) => {
            setIsCorrect(draft.isCorrect || false);

            let id = setInterval(() => {
                let editor = editorRef.current?.getEditor();

                if (!editor) {
                    return;
                }

                editor.commands.setContent(draft.content);
                clearInterval(id);
            }, 10);
        }
    }) as AnswerRef);

    return (
        <div className={styles.answer}>
            <h4 className={styles.answer_title}>Вірна відповідь:</h4>
            <Checkbox
                checked={isCorrect}
                onChange={e => {
                    uncheckAllAnswers();
                    setIsCorrect(!isCorrect);
                }}
                style={{marginRight: 10}}
                className={styles.answer_checkbox}
            />

            
            <Tiptap
                className={"ant-input ant-input-outlined " + styles.answer_input}
                style={{flex: 1}}
                ref={editorRef}
                openImageUploadModal={openImageUploadModal}
            />

            

            <div className={styles.answer_buttons}>
                <Button
                    danger
                    shape="circle"
                    type="text"
                    size="large"
                    icon={<CloseCircleOutlined />}
                    onClick={deleteAnswer}
                    className={styles.answerDeleteButton}
                />
                <Button onClick={() => orderAnswer(true)} type="dashed" shape="circle" icon={<UpCircleOutlined />} />
                <Button onClick={() => orderAnswer(false)} type="dashed" shape="circle" icon={<DownCircleOutlined />} />
            </div>
        </div>
    )
})

const TextAnswer = React.forwardRef(function TextAnswer(
    {deleteAnswer, orderAnswer}:
    {deleteAnswer: () => void, orderAnswer: (up: boolean) => void}, ref) {
    const [content, setContent] = useState("");
    
    useImperativeHandle(ref, () => ({
        getData: () => ({
            isCorrect: undefined,
            content: content
        }),
        uncheck: () => {},
        loadFromDraft: (draft) => {
            setContent(draft.content);
        }
    }) as AnswerRef);

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
    getData: () => TestsNamespace.Question,
    loadFromDraft: (draft: TestsNamespace.Question) => void
};

const Question = React.forwardRef(function Question(
    {index, modal, deleteQuestion, orderQuestion, openImageUploadModal} :
    {index: number, modal: HookAPI, deleteQuestion: () => void, orderQuestion: (up: boolean) => void, openImageUploadModal: (cb: (url: string) => void) => void},
ref) {
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
        }),
        loadFromDraft: (draft) => {
            let id = setInterval(() => {
                let editor = questionTitleEditorRef.current?.getEditor();
                if (!editor) {
                    return;
                }
                editor.commands.setContent(draft.title);
                clearInterval(id);
            }, 10);
            setType(draft.type);

            createAnswerByCount(draft.answers.length);
            for (let i = 0; i < draft.answers.length; i++) {
                let id = setInterval(() => {
                    setAnswers(answers => {
                        let ref = answers[i]?.ref;
                        if (!(ref && ref.current)) {
                            return answers;
                        }

                        ref.current.loadFromDraft(draft.answers[i]);
                        clearInterval(id);
                        return answers;
                    })
                }, 10);
            }
        },
    }) as QuestionRef);

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
                content: "Якщо ви змінюєте тип з однієї/кількох відповідей на текст (чи навпаки), існуючі варіанти відповідей зникнуть.",
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

     const createAnswerByCount = (count: number) => {
        let nArr = [...answers];
        for (let i = 0; i < count; i++) {
            nArr.push({
                id: answersCount + i,
                ref: React.createRef()
            })
        }
        setAnswers(nArr);
        setAnswersCount(answersCount + count);
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
                        {value: "MULTI_ANSWER", label: "Декілька правильних відповідей"},
                        {value: "TEXT", label: "Текст"}
                    ]}
                    style={{marginBottom: 10}}
                />
            </section>

            <section>
                <h3>Варіанти відповідей:</h3>
                <div className={styles.answers_div}>
                    <Reorder.Group
                        axis="y"
                        values={answers}
                        onReorder={setAnswers}
                    >
                        {(type != "TEXT") && answers.map(item =>
                            <Reorder.Item
                                as="div"
                                key={item.id}
                                value={item}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                            >
                                <Answer
                                    ref={item.ref}
                                    deleteAnswer={deleteAnswer.bind(null, item)}
                                    uncheckAllAnswers={uncheckAllAnswers}
                                    orderAnswer={orderAnswer.bind(null, item)}
                                    openImageUploadModal={openImageUploadModal}
                                />
                            </Reorder.Item>
                        )}
                        {(type == "TEXT") && answers.map(item =>
                            <Reorder.Item
                                as="div"
                                key={item.id}
                                value={item}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                            >
                                <TextAnswer
                                    ref={item.ref}
                                    deleteAnswer={deleteAnswer.bind(null, item)}
                                    orderAnswer={orderAnswer.bind(null, item)}
                                />
                            </Reorder.Item>
                        )}
                    </Reorder.Group>

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
    getData: () => TestsNamespace.Test | undefined,
    getDataAsDraft: () => Drafts.Test | undefined,
    loadFromDraft: (draft: Drafts.Test) => void
}

export const TestConstructor = React.forwardRef(function TestConstructor({passingGradeEnabled}:{passingGradeEnabled?: boolean}, ref) {
    type question = {
        id: number,
        ref: React.RefObject<QuestionRef>
    };
    const [questions, setQuestions] = useState<question[]>([]);
    const [questionCount, setQuestionCount] = useState(0);

    const [modal, modalCtxHolder] = Modal.useModal();

    const [testDuration, setTestDuration] = useState<Dayjs | null>(null);
    const [passingGrade, setPassingGrade] = useState(70);

    const err = (ind: number, str: string) => {
        modal.error({
            title: "Помилка.",
            maskClosable: true,
            content: <p>В запитанні №{ind+1}: {str}</p>
        })
    };

    const checkIfCorrectly = (data: (TestsNamespace.Question | undefined)[]) => {
        if (passingGradeEnabled && passingGrade < 0) {
            modal.error({
                title: "Помилка.",
                maskClosable: true,
                content: <p>Прохідний бал не може бути меньшим за 0.</p>
            });
            return false;
        }

        if (data.length < 1) {
            modal.error({
                title: "Помилка.",
                maskClosable: true,
                content: <p>Має бути принаймні одне питання..</p>
            })
            return false;
        }

        let testTimestamp = testDuration ? dayjsTimeToMs(testDuration) : undefined;
        if (testTimestamp && (testTimestamp < 10_000 || testTimestamp > 18_000_000)) {

            modal.error({
                title: "Помилка.",
                content: <p>Час тесту повинен бути в межах від 10 секунд до 5 годин.</p>
            });
            return;
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
                    err(i, "Кількість відповідей не може бути меншою за 2.");
                    return false;
                }
                let isOneCorrect = false;
                for (let j = 0; j < question.answers.length; j++) {
                    question.answers[j].content = question.answers[j].content.trim();
                    if (countWordsInHtmlString(question.answers[j].content) == 0) {
                        err(i, "У відповіді №"+(j+1)+": Відповідь не може бути порожньою.");
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
                        err(i, "У відповіді №"+(j+1)+": Відповідь не може бути порожньою.");
                        return false;
                    }
                }
            }

            if (question.answers.length > 5) {
                err(i, "В питанні може бути не більше 5 відповідей.");
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
                    time: dayjsTimeToMs(testDuration),
                    ...(passingGradeEnabled ? {passing_grade: passingGrade} : {})
                },
                ...data
            ];
        },

        getDataAsDraft: () => {
            return [
                {
                    time: testDuration ? (testDuration.unix() * 1000) : undefined,
                    ...(passingGradeEnabled ? {passing_grade: passingGrade} : {})
                },
                ...questions.map(item => item.ref.current?.getData())
            ];
        },

        loadFromDraft: (draft) => {
            let generalInfo = draft[0];

            if (generalInfo?.time) {
                setTestDuration(dayjs(generalInfo.time));
            }
            if (generalInfo?.passing_grade) {
                setPassingGrade(generalInfo.passing_grade);
            }
            
            createQuestionsByCount(draft.length-1);

            for (let i = 1; i < draft.length; i++) {
                let id = setInterval(() => {
                    setQuestions(questions => {
                        let ref = questions[i-1]?.ref;
                        if (!(ref && ref.current)) {
                            return questions;
                        }

                        ref.current.loadFromDraft(draft[i] as TestsNamespace.Question);
                        clearInterval(id);

                        return questions;
                    })
                }, 10);
            }

        }
    }) as TestConstructorRef);

    const createNewQuestion = () => {
        setQuestions([...questions, {
            id: questionCount,
            ref: React.createRef(),
        }]);
        setQuestionCount(questionCount + 1);
    };

    const createQuestionsByCount = (count: number) => {
        let nArr = [...questions];
        for (let i = 0; i < count; i++) {
            nArr.push({
                id: questionCount + i,
                ref: React.createRef()
            })
        }
        setQuestions(nArr);
        setQuestionCount(questionCount + count);
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
                    onChange={(e,e2) => {
                        if (!e) {
                            setTestDuration(null);
                            return;
                        }
                        setTestDuration(e)
                    }}
                    value={testDuration}
                    showNow={false}
                />
            </section>

            {passingGradeEnabled &&
                <section>
                    <h2 style={{marginBottom: 10}}>Прохідний бал:</h2>
                    <Input
                        value={passingGrade}
                        onChange={val => setPassingGrade(parseInt(val.target.value))}
                        type="number"
                    />
                </section>
            }

            <Divider orientationMargin={30} orientation="right" dashed>Питання</Divider>
            
            <p>В заголовках запитання або в текстових відповідях можна форматувати текст або додавати математичні формули. Докладніше про це можна дізнатися за цим <a href="/faq/text_formatting">посиланням.</a></p>
            
            {questions.map((item,i) =>
                <Question
                    key={i}
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