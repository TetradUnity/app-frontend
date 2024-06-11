import TestResult from "@/components/TestResult";
import { IStudentShortInfo, TestsNamespace } from "@/types/api.types";
import { Button, Divider, Modal } from "antd";

const MOCK_QUESTIONS: TestsNamespace.CandidateQuestion[] = [
    {
        title: "Питання",
        answers: [
            {content: "Відповідь 1", isCorrect: false},
            {content: "Відповідь 2", isCorrect: true},
            {content: "Відповідь 3", isCorrect: false},
        ],
        type: "ONE_ANSWER",
        your_answer: [0]
    },
    {
        title: "Питання",
        answers: [
            {content: "Відповідь 1", isCorrect: true},
            {content: "Відповідь 2", isCorrect: false},
            {content: "Відповідь 3", isCorrect: true},
        ],
        type: "MULTI_ANSWER",
        your_answer: [0, 1]
    },
    {
        title: "Питання",
        answers: [
            {content: "Відповідь 1", isCorrect: true},
            {content: "Відповідь 2", isCorrect: false},
            {content: "Відповідь 3", isCorrect: true},
        ],
        type: "MULTI_ANSWER",
        your_answer: [0, 1]
    },
    {
        title: "Питання",
        answers: [
            {content: "bah"}
        ],
        type: "TEXT",
        your_answer: ["vah"]
    },
];

type TestResultViewerModalProps = {
    isOpen: boolean,
    student: IStudentShortInfo | null,
    close: () => void
};
export default function TestResultViewerModal({isOpen, student, close} : TestResultViewerModalProps) {
    return (
        <>
            <Modal
                title="Перегляд тесту студента"
                open={isOpen}
                footer={<Button type="primary" onClick={close}>Закрити</Button>}
                onCancel={close}
            >
                {student &&
                <>
                    <p style={{fontSize: 30, textAlign: "center"}}>{student.first_name} {student.last_name}</p>

                    <Divider style={{marginTop: 15, marginBottom: 15}} />

                    <TestResult questions={MOCK_QUESTIONS} slotColor="var(--foreground-lighter-0_5)" />
                </>}
            </Modal>
        </>
    )
}