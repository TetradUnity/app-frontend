import { TestsNamespace } from "@/types/api.types";
import Tiptap from "./Tiptap";
import { Checkbox, Input, Radio, Space } from "antd";

type TestResultProps = {
    questions: TestsNamespace.Question[] | TestsNamespace.CandidateQuestion[],
    slotColor?: string
};

const checkIfCorrectTextAnswer = (question: TestsNamespace.CandidateQuestion) => {
    let yourAnswer = (question.your_answer[0] as string || '');

    for (let i = 0; i < question.answers.length; i++) {
        if (yourAnswer == question.answers[i].content) {
            return true;
        }
    }

    return false;
}

const getAnswerColor = (answer: TestsNamespace.Answer) => {
    if (answer.isCorrect == undefined) {
        return undefined;
    }
    return answer.isCorrect ? "#34eb37" : "#c9576a";
}

const getTextAnswerColor = (question: TestsNamespace.CandidateQuestion) => {
    if (question.answers == undefined || question.answers.length == 0) {
        return undefined;
    }
    return checkIfCorrectTextAnswer(question) ? "#34eb37" : "#c9576a";
}

const isCandidateQuestion = (question: TestsNamespace.Question | TestsNamespace.CandidateQuestion): question is TestsNamespace.CandidateQuestion => {
    return (question as TestsNamespace.CandidateQuestion).your_answer !== undefined;
}

export default function TestResult({questions, slotColor} : TestResultProps) {
    return (
        <>
            {questions.map((question, i) => 
                <div key={i} style={{background: slotColor || "var(--foreground-lighter-1_5)", padding: 20, marginTop: 10, borderRadius: 9}}>
                    <h3 style={{marginBottom: 5, color: "rgb(200,200,200)"}}>
                        Питання №{i + 1}
                    </h3>

                    <Tiptap style={{marginBottom: 10, fontSize: 17}}
                        editable={false} content={question.title}/>
                    
                    {question.type == "ONE_ANSWER" &&
                        <Radio.Group value={isCandidateQuestion(question) ? question.your_answer[0] : undefined}>
                            <Space direction="vertical">
                                {question.answers.map((answer, i) =>
                                    <Radio key={i} value={i}>
                                        <Tiptap
                                            style={{
                                                fontSize: 17,
                                                color: getAnswerColor(answer)
                                            }}
                                            editable={false}
                                            content={answer.content}
                                        />
                                    </Radio>
                                )}
                            </Space>
                        </Radio.Group>
                    }
                    
                    {question.type == "MULTI_ANSWER" &&
                        <Checkbox.Group
                            value={isCandidateQuestion(question) ? question.your_answer as number[] : []}
                            options={
                                question.answers.map((answer, i) => ({
                                    label: <Tiptap
                                                key={i}
                                                style={{
                                                    fontSize: 17,
                                                    margin: "3px 0",
                                                    color: getAnswerColor(answer)
                                                }}
                                                editable={false}
                                                content={answer.content}
                                            />,
                                    value: i
                                }))
                            }
                        />
                    }

                    {question.type == "TEXT" &&
                        (isCandidateQuestion(question)
                            ? <Input
                                style={{
                                    color: getTextAnswerColor(question)
                                }}
                                value={question.your_answer[0]}
                            />
                            : question.answers.map((answer, i) => 
                                <Input
                                    key={i}
                                    style={{
                                        color: "#34eb37"
                                    }}
                                    value={answer.content}
                                />
                            )
                        )
                    }
                </div>
            )}
        </>
    )
}