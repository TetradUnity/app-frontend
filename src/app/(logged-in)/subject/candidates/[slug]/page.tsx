'use client';

import { ICandidate, TestsNamespace } from "@/types/api.types";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Input, Modal, Radio, Space, Spin, Table, TableColumnsType, Tooltip } from "antd";

import styles from "@/styles/announced_subject.module.css";
import { UploadService, UploadType } from "@/services/upload.service";
import { AnnouncedSubjectService } from "@/services/announced_subject.service";
import { formatTimeInSeconds } from "@/utils/TimeUtils";
import translateRequestError from "@/utils/ErrorUtils";
import Tiptap from "@/components/Tiptap";
import TestResult from "@/components/TestResult";
import { pluralize } from "@/utils/InternalizationUtils";

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
    useEffect(() => {
        if (isOpened && candidate) {
            document.title = "Кандидат / " + candidate.first_name + " " + candidate.last_name;
        } else {
            document.title = "Кандидати";
        }
    }, [isOpened, candidate]);

    if (!(candidate && questions)) {
        return null;
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
                <TestResult questions={questions} />
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
    const [candidatesCount, setCandidatesCount] = useState(0);
    const [candidatesAverageGrade, setCandidatesAverageGrade] = useState(0);
    const [hasExam, setHasExam] = useState(false);
    const [title, setTitle] = useState('');
    const [banner, setBanner] = useState('');
    const [isPageLoading, setIsPageLoading] = useState(false);

    const [error, setError] = useState('');

    const [candidateModalVisible, setCandidateModalVisible] = useState(false);

    const { replace } = useRouter();

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
                   <div style={{display: "block", margin: "auto", width: "fit-content"}}>
                        <Tooltip title="Відказати студенту бути участником вашого предмету">
                            <Button
                                type="primary"
                                shape="circle"
                                danger
                                icon={<DeleteOutlined />}
                                style={{display: "inline-block", marginRight: 5}}
                                onClick={() => rejectStudent(record.id, index)}
                            />
                        </Tooltip>

                       {hasExam &&
                        <Tooltip title="Подробніше">
                            <Button
                                type="dashed"
                                shape="circle"
                                icon={<InfoCircleOutlined />}
                                style={{display: "inline-block"}}
                                onClick={() => fetchStudentInfo(record.id, index)}
                            />
                        </Tooltip>
                    }
                   </div>
                )
            }
        }
    ];
    if (!hasExam) {
        tableColumns = tableColumns.filter((_, i) => i != 1);
    }
    
    const fetchRef = useRef({
        loading: false,
        page: 1,
        isEnd: false
    });

    const fetchCandidates = () => {
        if (fetchRef.current.isEnd) return;
        if (fetchRef.current.loading) return;

        setIsPageLoading(true);

        let subjectId = parseInt(slug as string);
        
        if (!subjectId || subjectId < 0) {
            setNotFound(true);
            return;
        }

        fetchRef.current.loading = true;

        AnnouncedSubjectService.getCandidates(subjectId, fetchRef.current.page).then(response => {

            if (!response.success) {
                if (response.error_code == "not_found") {
                    setNotFound(true);
                }
                setError(response.error_code!);
                return;
            }

            setTitle(response.title!);
            setBanner(response.banner!);
            setHasExam(response.has_exam!);
            setCandidatesCount(response.count_candidates!);
            setCandidates(prev => prev ? [...prev, ...response.data!] : response.data!);
            setCandidatesAverageGrade(Math.round(response.average_result!));
            fetchRef.current.isEnd = response.data!.length == 0;
            fetchRef.current.page += 1;
            fetchRef.current.loading = false;
            setIsLoaded(true);
            setIsPageLoading(false);
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
            content: <p>Перегляньте уважно, чи всі підходять на ваш предмет!</p>,
            onOk: async () => {
                const resp = await AnnouncedSubjectService.approveStudents(parseInt(slug as string));

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

        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
                return;
            }

            fetchCandidates();
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (error) {
        return <p style={{textAlign: "center", fontSize: 25}}>Трапилась помилки при завантаженні кандидатів: {error}</p>
    }

    if (!(isLoaded && candidates)) {
        return <Spin spinning style={{display: "block", margin: "auto"}} />;
    }

    if (isNotFound) {
        replace("/home");
    }

    return (
        <div className={styles.slot}>
            <div className={styles.banner}>
                <img src={UploadService.getImageURL(UploadType.BANNER, banner)} alt="banner" />
                <h1 style={{bottom: 20}}>{title}</h1>
            </div>

           <div className={styles.content}>
                <h1>{pluralize(candidatesCount, ["кандидат", "кандидата", "кандидатів"])}</h1>
                <p>Середній бал: {candidatesAverageGrade}</p>
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
                        Сформувати список
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