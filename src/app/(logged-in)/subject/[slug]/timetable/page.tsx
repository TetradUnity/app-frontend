'use client';

import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import type { BadgeProps, MessageArgsProps } from 'antd';
import { Badge, Button, DatePicker, Divider, Input, Modal, Spin, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { MessageInstance } from 'antd/es/message/interface';

import styles from "../styles.module.css";
import { differenceBetweenTwoDatesInSec, formatTimeInSeconds } from '@/utils/TimeUtils';
import { SubjectNamespace } from '@/types/api.types';
import { CalendarService } from '@/services/calendar.service';
import { useParams } from 'next/navigation';
import translateRequestError from '@/utils/ErrorUtils';
import Calendar from '@/components/Calendar';
import { pluralize } from '@/utils/InternalizationUtils';
import { useProfileStore } from '@/stores/profileStore';
import { useShallow } from 'zustand/react/shallow';
import { ConferenceService } from '@/services/conference.service';
import Link from 'next/link';

const DateInfoModal = (
    {modalVisible, setModalVisible, info, callFetch}
    :
    {info: DayAttachments | undefined, modalVisible: boolean, setModalVisible: Dispatch<SetStateAction<boolean>>, callFetch: () => void}
) => {
    const {slug} = useParams();

    const role = useProfileStore(useShallow(state => state.role));

    const [conferenceUrl, setConferenceUrl] = useState('');
    const [conferenceDate, setConferenceDate] = useState<Dayjs | null>();
    const [blocked, setBlocked] = useState(false);

    const [msg, msgCtx] = message.useMessage();

    const onSubmit = () => {
        if (!(conferenceUrl && conferenceDate)) {
            return;
        }

        setBlocked(true);

        ConferenceService.createConference({
            date: conferenceDate.unix() * 1000,
            link: conferenceUrl,
        subject_id: parseInt(slug as string)
        }).then(resp => {
            setBlocked(false);

            if (!resp.success) {
                msg.error("Не вдалось назначити конференцію: " + translateRequestError(resp.error_code));
                return;
            }

            msg.success("Успіх!");

            setConferenceDate(null);
            setConferenceUrl('');

            setModalVisible(false);

            callFetch();
        })
    }

    if (!info) {
        return;
    }

    return (
        <>
            <Modal
                title="Перегляд"
                open={modalVisible}
                centered
                onCancel={() => setModalVisible(false)}
                footer={<Button onClick={() => setModalVisible(false)} type="primary">Закрити</Button>}
            >
                {(info.materials.length > 0)
                    ? <>
                        <Divider />

                        <section>
                            <h3>Навчальні матеріали:</h3>
                            {info.materials.map((item, i) => 
                                <Link href={"/subject/" + slug + "/assignments/" + item.id} className={styles.modal_item} key={i}>
                                    {(i+1) +". "}{(item as SubjectNamespace.IEvent).title}
                                </Link>
                            )}
                        </section>
                    </>
                    : null
                }

                {(info.tests.length > 0)
                    ? <>
                        <Divider />

                        <section>
                            <h3>Тести:</h3>
                            {info.tests.map((item, i) => 
                                <Link href={"/subject/" + slug + "/assignments/" + item.id} className={styles.modal_item} key={i}>
                                    {(i+1) +". "}{(item as SubjectNamespace.IEvent).title}
                                </Link>
                            )}
                        </section>
                    </>
                    : null
                }

                {(info.conferences.length > 0)
                    ? <>
                        <Divider />

                        <section>
                            <h3>Конференції:</h3>
                            {info.conferences.map((item, i) => 
                                <div key={i} className={styles.conference_modal_p + " " + styles.modal_conference}>
                                    <p>{(i+1) +". "}Конференція {dayjs(item.date).format("D MMMM о HH:mm")}</p>
                                    <Link href={(item as SubjectNamespace.IEvent).title}>
                                        {(item as SubjectNamespace.IEvent).title}
                                    </Link>
                                </div>
                            )}
                        </section>
                    </>
                    : null
                }

                {(info.grades.length > 0)
                    ? <>
                        <Divider />

                        <section>
                            <h3>Оцінки:</h3>
                            {info.grades.map((item, i) => 
                                <div className={styles.conference_modal_p} key={i}>
                                    {(i+1) +". "}
                                    Ви отримали {pluralize(Math.round((item as SubjectNamespace.IGrade).value), ["бал ", "бала ", "балів "])}
                                    по причині: {(item as SubjectNamespace.IGrade).reason}.
                                </div>
                            )}
                        </section>
                    </>
                    : null
                }

                {(role == "TEACHER") &&
                <>
                    <Divider />
                    <section>
                            <h3>Назначити конференцію</h3>

                            <p style={{marginTop: 10}}>Посилання на конференцію:</p>
                            <Input
                                value={conferenceUrl}
                                onChange={e => setConferenceUrl(e.target.value)}
                                style={{marginTop: 5}}
                            />

                            <p style={{marginTop: 10}}>Дата:</p>
                            <DatePicker
                                showTime
                                style={{marginTop: 5, width: "100%"}}
                                value={conferenceDate}
                                onChange={value => setConferenceDate(value)}
                            />

                            <Button
                                disabled={blocked}
                                type="dashed"
                                style={{display: "block", margin: "auto", marginTop: 15}}
                                onClick={onSubmit}
                            >
                                Назначити
                            </Button>
                    </section>
                </>
                }

                {(role == "TEACHER" && (info.conferences.length > 0)) &&
                <>
                    <Divider />
                    <section>
                            <h3>Оцінити студента</h3>
                            :TODO
                    </section>
                </>
                }

                <Divider />
            </Modal>
            {msgCtx}
        </>
    )
}

type SingleItemType = SubjectNamespace.IGrade | SubjectNamespace.IEvent;
type ItemType = SubjectNamespace.IGrade & SubjectNamespace.IEvent;
type ItemsType = SubjectNamespace.IGrade[] | SubjectNamespace.IEvent[];

type DayAttachments = {
    grades: ItemsType,
    materials: ItemsType,
    conferences: ItemsType,
    tests: ItemsType
}

const isGrade = (item: SingleItemType): item is SubjectNamespace.IGrade => {
    return (item as SubjectNamespace.IGrade).reason !== undefined;
} 

export default function SubjectTimetable() {
    const { slug } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [items, setItems] = useState<ItemsType>([]);
    const [date, setDate] = useState<Dayjs>(dayjs());

    const [dayInfo, setDayInfo] = useState<DayAttachments>();

    const [modalVisible, setModalVisible] = useState(true);

    const fetch = () => {
        setLoading(true);

        CalendarService.getMonth(
            date.year(), date.month(),
            {withGrade: false, subjects_id: [parseInt(slug as string)]}
        ).then(resp => {
            if (!resp.success) {
                setError(resp.error_code!);
                return;
            }

            setItems(resp.data!);
            setLoading(false);
        })
    }

    const onCellClick = ({year, month, day} : {year: number, month: number, day: number}) => {
        const attachedToThisDate: DayAttachments = {
            grades: [], materials: [], conferences: [], tests: []
        }

        let item = null;
        let itemDate = null;
        for (let i = 0; i < items.length; i++) {
            item = items[i];
            itemDate = dayjs(item.date);
            if (year == itemDate.year() && month == itemDate.month() && day == itemDate.date()) {
                if(isGrade(item)) attachedToThisDate.grades.push(item as ItemType);
                else {
                    if (item.type == "conference") attachedToThisDate.conferences.push(item as ItemType);
                    else if (item.type == "test") attachedToThisDate.tests.push(item as ItemType);
                    else if (item.type == "education_material") attachedToThisDate.materials.push(item as ItemType);
                }
            }
        }

        setDayInfo(attachedToThisDate);
        setModalVisible(true);
    }

    useEffect(() => {
        fetch();
    }, [date]);
    
    if (error) {
        return <p style={{textAlign: "center", fontSize: 20}}>Не получилось завантажити: {translateRequestError(error)}</p>
    }

    if (loading) {
        return <Spin style={{display: "block", margin: "auto"}} spinning />
    }    

    const Cell = ({year, month, day} : {year: number, month: number, day: number}) => {
        const attachedToThisDate = useMemo(() => {
            const dict = {
                grades: 0, materials: 0, conferences: 0, tests: 0
            }

            let item = null;
            let itemDate = null;
            for (let i = 0; i < items.length; i++) {
                item = items[i];
                itemDate = dayjs(item.date);
                if (year == itemDate.year() && month == itemDate.month() && day == itemDate.date()) {
                    if(isGrade(item)) dict.grades++;
                    else {
                        if (item.type == "conference") dict.conferences++;
                        else if (item.type == "test") dict.tests++;
                        else if (item.type == "education_material") dict.materials++;
                    }
                }
            }

            return dict;
        }, [items]);

        return (
            <div style={{display: "block"}}>
                {(attachedToThisDate.grades > 0) &&
                    <Badge
                        text={pluralize(attachedToThisDate.grades, ['оцінка', 'оцінки', 'оцінок'])}
                        status="warning"
                        style={{display: "block"}}
                    />
                }

                {(attachedToThisDate.materials > 0) &&
                    <Badge
                        text={pluralize(attachedToThisDate.materials, ['завдання', 'завдання', 'завдань'])}
                        status="processing"
                        style={{display: "block"}}
                    />
                }

                {(attachedToThisDate.conferences > 0) &&
                    <Badge
                        text={pluralize(attachedToThisDate.conferences, ['конференція', 'конференції', 'конференцій'])}
                        status="success"
                        style={{display: "block"}}
                    />
                }

                {(attachedToThisDate.tests > 0) &&
                    <Badge
                        text={pluralize(attachedToThisDate.tests, ['тест', 'теста', 'тестів'])}
                        status="error"
                        style={{display: "block"}}
                    />
                }
            </div>
        )
    }

    return (
        <>
            <Calendar
                initialDate={date}
                onCellClick={onCellClick}
                onChange={date => setDate(date)}
                cellRenderer={Cell}
            />
            <DateInfoModal
                info={dayInfo}
                callFetch={() => fetch()}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
            />
        </>
    )
}