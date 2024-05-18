'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import type { BadgeProps, CalendarProps, MessageArgsProps } from 'antd';
import { Badge, Button, Calendar, Divider, Modal, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { MessageInstance } from 'antd/es/message/interface';

import styles from "../styles.module.css";
import { differenceBetweenTwoDatesInSec, formatTimeInSeconds } from '@/utils/TimeUtils';

interface Conference {
    type: "zoom" | "google_meet" | "microsoft_teams",
    approximate_time_start: number,
    approximate_time_end: number,
    url: string
};

let timetable_mock: {[key: string] : Conference} = {
    "05-20-2024": {
        type: "google_meet",
        approximate_time_start: (1716220800 - 3602) * 1000,
        approximate_time_end: 1716220800 * 1000,
        url: "https://meet.google.com/ezo-dqyi-osr"
    },

    "05-05-2024": {
        type: "zoom",
        approximate_time_start: 1714921200 * 1000,
        approximate_time_end: 1714924800 * 1000,
        url: "https://conference.zoom.com/nlk-bslt-nqi"
    },
};

const get_conference_status = (info: Conference): "already" | "currently" | "will_be" => {
    let start_date = info.approximate_time_start;
    let end_date = info.approximate_time_end;

    let current = Date.now();

    let status: "already" | "currently" | "will_be" = "currently";
    if (current < start_date) {
        status = "will_be";
    } else if (current > end_date) {
        status = "already";
    }

    return status;
}

const STATUS_TRANSLATES = {
    "already": "Конференція вже відбулась",
    "currently": "Конференція триває в даний момент",
    "will_be": "Конференція ще не відбулась"
};
const CONF_TYPE_TRANSLATES = {
    "zoom": "Zoom",
    "google_meet": "Google Meet",
    "microsoft_teams": "Microsoft Teams"
};

const ConferenceInfoModal = (
    {conferceModalVisible, setConferceModalVisible, selectedDate}
    :
    {conferceModalVisible: boolean, selectedDate: string, setConferceModalVisible: Dispatch<SetStateAction<boolean>>}
) => {
    const closeModal = () => setConferceModalVisible(false);

    let [conferenceInfo, setConferenceInfo] = useState<Conference>();
    useEffect(() => {
        setConferenceInfo(timetable_mock[selectedDate]);
    }, [selectedDate]);

    if (!conferenceInfo) {
        return null;
    }

    return (
        <Modal
            title="Конференція"
            open={conferceModalVisible}
            centered
            onCancel={closeModal}
            footer={<Button onClick={closeModal} type="primary">Зрозуміло</Button>}
        >
            <Divider />
            <section>
                <h3>Дата:</h3>
                <p className={styles.conference_modal_p}>
                    {dayjs(conferenceInfo.approximate_time_start).format("D MMM HH:mm")}
                    {" - "}
                    {dayjs(conferenceInfo.approximate_time_end).format("D MMM HH:mm")}
                    {" ("
                    + formatTimeInSeconds(differenceBetweenTwoDatesInSec(
                        conferenceInfo.approximate_time_start,
                        conferenceInfo.approximate_time_end
                    ))
                    + ")"
                    }
                </p>
            </section>
            
            <Divider />
            <section>
                <h3>Статус:</h3>
                <p className={styles.conference_modal_p}>{
                    STATUS_TRANSLATES[get_conference_status(conferenceInfo)]
                }</p>
            </section>

            <Divider />
            <section>
                <h3>Платформа:</h3>
                <p className={styles.conference_modal_p}>{CONF_TYPE_TRANSLATES[conferenceInfo.type]}</p>
            </section>

            <Divider />
            <section>
                <h3>Посилання:</h3>
                <p className={styles.conference_modal_p}>
                    <a href={conferenceInfo.url}>
                        {conferenceInfo.url}
                    </a>
                </p>
            </section>

            <Divider />
        </Modal>
    )
}

function TimeTableCalendar({messageApi, setSelectedDate, setConferceModalVisible}: {messageApi: MessageInstance, setSelectedDate: Dispatch<SetStateAction<string>>, setConferceModalVisible: Dispatch<SetStateAction<boolean>>}) {
    const DateCellRender = ({value} : {value: Dayjs}) => {
        let conference = timetable_mock[value.format("MM-DD-YYYY")];
        if (!conference) {
            return null;
        }

        let status: BadgeProps["status"] = "success";

        switch(get_conference_status(conference)) {
            case "already":
                status = "warning";
                break;
            case "will_be":
                status = "processing";
                break;
        }

        return (
            <Badge status={status} text="Конференція" />
        )
  };

  return <Calendar
    style={{marginBottom: 40}}
    fullCellRender={(value, info) => {
        if (info.type != "date") {
            return info.originNode;
        }
        let key = value.format("MM-DD-YYYY");
        let isToday = key == dayjs().format("MM-DD-YYYY");

        return (
            <div
                className={styles.timetable_cell + " " + (isToday ? styles.timetable_cell_today : "")}
                onClick={() => {
                    let conference = timetable_mock[key];
                    
                    if (!conference) {
                        messageApi.open({
                            type: 'error',
                            content: 'В цю дану не вставлено конференцій.',
                        });
                        return;
                    };
                    
                    setSelectedDate(key);
                    setConferceModalVisible(true);
                }}
            >
                <p>{value.date()}</p>
                {isToday && <p style={{fontSize: 14}}>(Сьогодні)</p>}
                <DateCellRender value={value} />
            </div>
        )
    }}
  />;
}

export default function SubjectTimetable() {
    const [conferceModalVisible, setConferceModalVisible] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const [messageApi, contextHolder] = message.useMessage();

   return (
    <>
        <TimeTableCalendar setSelectedDate={setSelectedDate} setConferceModalVisible={setConferceModalVisible} messageApi={messageApi} />
        <ConferenceInfoModal selectedDate={selectedDate} conferceModalVisible={conferceModalVisible} setConferceModalVisible={setConferceModalVisible} />
        {contextHolder}
    </>
   )
}