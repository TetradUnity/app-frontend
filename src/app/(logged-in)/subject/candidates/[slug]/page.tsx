'use client';

import { ICandidate, TestsNamespace } from "@/types/api.types";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Input, Modal, Radio, Space, Spin, Table, TableColumnsType, Tooltip, message } from "antd";

import styles from "@/styles/announced_subject.module.css";
import { UploadService, UploadType } from "@/services/upload.service";
import { AnnouncedSubjectService } from "@/services/announced_subject.service";
import { formatTimeInSeconds } from "@/utils/TimeUtils";
import translateRequestError from "@/utils/ErrorUtils";
import Tiptap from "@/components/Tiptap";

interface DataType {
    key: React.Key,
    id: number,
    firstNameAndLastName: string,
    grade: number,
}

type CandidateInfoModalProps = {
    isOpened: boolean,
    candidate: ICandidate,
    questions: TestsNamespace.CandidateQuestion[],
    close: () => void
};

const CandidateInfoModal = ({isOpened, candidate, questions, close} : CandidateInfoModalProps) => {
    if (!(candidate && questions)) {
        return null;
    }

    const checkIfCorrectTextAnswer = (question: TestsNamespace.CandidateQuestion) => {
        let yourAnswer = (question.your_answer[0] as string || '');

        for (let i = 0; i < question.answers.length; i++) {
            if (yourAnswer == question.answers[i].content) {
                return true;
            }
        }

        return false;
    }

    return (
        <Modal
            title="Інформація про кандидата"
            footer={<Button type="primary" onClick={close}>Зрозуміло</Button>}
            open={isOpened}
            onCancel={close}
            maskClosable
            centered
            width={650}
        >
            <Divider />

            <section>
                <h3>Поштова скринька:</h3>
                <p className={styles.modal_p}>
                    {candidate.email}
                </p>
            </section>

            <Divider />

            {candidate.duration &&
                <section>
                    <h3>Витрачено часу на проходження екзамену:</h3>
                    <p className={styles.modal_p}>
                        {formatTimeInSeconds(candidate.duration / 1000)}
                    </p>
                </section>
            }

            <Divider />

            <section>
                <h3>Відповіді:</h3>
                {questions.map((question, i) => 
                    <div style={{background: "var(--foreground-lighter-1_5)", padding: 20, marginTop: 10, borderRadius: 9}}>
                        <h3 style={{marginBottom: 5, color: "rgb(200,200,200)"}}>
                            Питання №{i + 1}
                        </h3>

                        <Tiptap style={{marginBottom: 10, fontSize: 17}}
                            editable={false} content={question.title}/>
                        
                        {question.type == "ONE_ANSWER" &&
                            <Radio.Group value={question.your_answer[0]}>
                                <Space direction="vertical">
                                    {question.answers.map((answer, i) =>
                                        <Radio key={i} value={i}>
                                            <Tiptap
                                                style={{
                                                    fontSize: 17,
                                                    color: answer.isCorrect ? "#34eb37" : "#c9576a"
                                                }}
                                                editable={false}
                                                content={answer.content}
                                            />
                                        </Radio>
                                    )}
                                </Space>
                            </Radio.Group>
                        }
                        
                        {question.type == "MULTY_ANSWER" &&
                            <Checkbox.Group
                                value={question.your_answer as number[]}
                                options={
                                    question.answers.map((answer, i) => ({
                                        label: <Tiptap
                                                    style={{
                                                        fontSize: 17,
                                                        margin: "3px 0",
                                                        color: answer.isCorrect ? "#34eb37" : "#c9576a"
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
                            <Input
                                style={{
                                    color: checkIfCorrectTextAnswer(question) ? "#34eb37" : "#c9576a"
                                }}
                                value={question.your_answer[0]}
                            />
                        }
                    </div>
                )}
            </section>

            <Divider />
        </Modal>
    )
}

export default function AnnouncedSubject() {
    const params = useParams();
    let { slug } = params;

    const [modal, modalCtx] = Modal.useModal();

    const [isLoaded, setIsLoaded] = useState(false);
    const [isNotFound, setNotFound] = useState(false);

    const [candidates, setCandidates] = useState<ICandidate[] | undefined>(undefined);
    const [selectedCandidate, setSelectedCandidate] = useState(0);
    const [candidateQuestions, setCandidateQuestions] = useState<TestsNamespace.CandidateQuestion[]>([]);
    const [hasExam, setHasExam] = useState(false);
    const [title, setTitle] = useState('');
    const [banner, setBanner] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(false);

    const [candidateModalVisible, setCandidateModalVisible] = useState(false);

    let tableColumns: TableColumnsType<DataType> = [
        {
            title: "Ім'я та фамілія",
            dataIndex: "firstNameAndLastName",
        },
        {
            title: "Бал",
            dataIndex: "grade",
            showSorterTooltip: { target: 'full-header' },
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.grade - b.grade,
        },
        {
            title: "Операція",
            width: 1,
            render: (_, record, index) => {
                return (
                   <div style={{display: "block", margin: "auto"}}>
                        <Tooltip title="Відказати студенту бути участником вашого предмету">
                            <Button
                                type="primary"
                                shape="circle"
                                danger
                                icon={<DeleteOutlined />}
                                style={{display: "inline-block", marginRight: 10}}
                                onClick={() => rejectStudent(record.id, index)}
                            />
                        </Tooltip>

                        <Tooltip title="Подробніше">
                            <Button
                                type="dashed"
                                shape="circle"
                                icon={<InfoCircleOutlined />}
                                style={{display: "inline-block"}}
                                onClick={() => fetchStudentInfo(record.id, index)}
                            />
                        </Tooltip>
                   </div>
                )
            }
        }
    ];
    if (!hasExam) {
        tableColumns = tableColumns.filter((_, i) => i != 1);
    }
    
    const fetchCandidates = () => {
        setIsPageLoading(true);

        let subjectId = parseInt(slug as string);

        if (!subjectId || subjectId < 0) {
            setNotFound(true);
            return;
        }

        AnnouncedSubjectService.getCandidates(subjectId).then(response => {
            setIsLoaded(true);
            setIsPageLoading(false);

            if (!response.success) {
                setNotFound(true);
                return;
            }

            setTitle(response.title as string);
            setBanner(response.banner as string);
            setHasExam(response.has_exam as boolean);
            setCandidates(response.data);
        })
    }

    const rejectStudent = async (id: number, index: number) => {
        modal.confirm({
            title: "Ви впевнені?",
            // @ts-ignore
            content: <p>{candidates[index].first_name} {candidates[index].last_name} не буде мати участь в вашому предметі.</p>,
            okText: "Видалити",
            cancelText: "Скасувати",
            onOk: async () => {
                const resp = await AnnouncedSubjectService.rejectCandidate(id);

                if (!resp.success) {
                    modal.error({
                        title: "Сталася помилка",
                        content: <p>{translateRequestError(resp.error_code)}</p>
                    });
                    return;
                }

                fetchCandidates();
            }
        });
    }

    const fetchStudentInfo = async (id: number, index: number) => {
        const resp = await AnnouncedSubjectService.getAnswersCandidate(id);

        if (!resp.success) {
            modal.error({
                title: "Сталася помилка",
                content: <p>{translateRequestError(resp.error_code)}</p>
            });
            return;
        }

        setCandidateQuestions(resp.data as TestsNamespace.CandidateQuestion[]);
        setSelectedCandidate(index);
        setCandidateModalVisible(true);
    };

    const startSubject = () => {
        modal.confirm({
            title: "Ви впевнені?",
            content: <p>Цією дією ви почнете предмет. Учням на почтову скриньку прийде про це повідомлення.</p>,
            onOk: async () => {
                const resp = await AnnouncedSubjectService.startSubject(parseInt(slug as string));

                if (!resp.success) {
                    modal.error({
                        title: "Сталася помилка",
                        content: <p>{translateRequestError(resp.error_code)}</p>
                    });
                    return;
                }

                window.location.href = "/";
            }
        });
    }

    const cancelSubject = () => {
        modal.confirm({
            title: "Ви впевнені?",
            content: <>
                <p>Ця функція була створена для випадку, коли на Ваш предмет набралось мало студентів.</p>
                <p style={{marginTop: 3}}>Ви впевнені що хочете скасувати предмет?</p>
                <p style={{fontSize: 15, color: "rgb(210,210,210)", marginTop: 3}}>Учням на почтову скриньку прийде про це повідомлення.</p>
            </>,
            onOk: async () => {
                const resp = await AnnouncedSubjectService.cancelSubject(parseInt(slug as string));

                if (!resp.success) {
                    modal.error({
                        title: "Сталася помилка",
                        content: <p>{translateRequestError(resp.error_code)}</p>
                    });
                    return;
                }

                window.location.href = "/";
            }
        });
    }

    useEffect(() => {
       fetchCandidates();
    }, [])

    if (!(isLoaded && candidates)) {
        return null;
    }

    if (isNotFound) {
        notFound();
    }

    return (
        <div className={styles.slot}>
            <div className={styles.banner}>
                <img src={UploadService.getImageURL(UploadType.BANNER, banner)} alt="banner" />
                <h1 style={{bottom: 20}}>{title}</h1>
            </div>

           <div className={styles.content}>
                <h1>Кандидати</h1>
                <Divider />

                <Table
                    dataSource={candidates.map(candidate => ({
                        key: candidate.id.toString(),
                        id: candidate.id,
                        firstNameAndLastName: `${candidate.first_name} ${candidate.last_name}`,
                        grade: Math.round(candidate.result)
                    }))}
                    columns={tableColumns}
                    bordered
                    pagination={false}
                />

                <div style={{display: "block", marginLeft: "auto", width: "fit-content", marginTop: 15}}>
                    <Button
                        style={{
                            marginRight: 10
                        }}
                        type="primary"
                        onClick={cancelSubject}
                        danger
                    >
                        Скасувати предмет
                    </Button>

                    <Button
                        type="primary"
                        onClick={startSubject}
                    >
                        Почати предмет
                    </Button>
                </div>
           </div>

            <CandidateInfoModal
                isOpened={candidateModalVisible}
                close={() => setCandidateModalVisible(false)}
                candidate={candidates[selectedCandidate]}
                questions={candidateQuestions}
            />
            {isPageLoading && <Spin spinning fullscreen />}
            {modalCtx}
        </div>
    )
}