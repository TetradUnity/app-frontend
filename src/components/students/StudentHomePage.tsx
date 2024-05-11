'use client'
import {useState} from 'react';
import {Card, List} from "antd";

import { AuthService } from "@/services/auth.service"

export default function StudentHomePage() {
    // const [subjects, setSubjects] = useState([]);
    // const [grades, setGrades] = useState([]);

    // todo: fetch subjects and grades from the server
    const subjects = [
        "Math",
        "Physics",
        "Chemistry",
        "Biology",
        "History",
        "Geography",
        "Literature",
        "English",
        "Ukrainian",
        "Russian",
        "German",
    ];
    const lastGrades = [{
        subject: "Math",
        task: "logarithms test",
        grade: 5,
        when: Date.now(),
        teacherName: "Maxim Ivanov"
    }, {
        subject: "Physics",
        task: "homework",
        grade: 4,
        when: Date.UTC(2021, 5, 1),
        teacherName: "Ivan Petrov"
    }, {
        subject: "Chemistry",
        task: "lab work",
        grade: 3,
        when: Date.UTC(2021, 5, 3),
        teacherName: "Vasyl Ivanov"
    }, {
        subject: "Biology",
        task: "test",
        grade: 4,
        when: Date.UTC(2021, 5, 5),
        teacherName: "Ivan Petrov"
    }, {
        subject: "History",
        task: "essay",
        grade: 5,
        when: Date.UTC(2021, 5, 7),
        teacherName: "Maxim Ivanov"
    }];

    return (
        <>
            <h1>Головна сторінка для студента</h1>
            <List pagination={{pageSize: 8}}
                  header={<h2>Subjects</h2>}
                  split={false}
                  grid={{gutter: 16, column: 4}}
                  dataSource={subjects}
                  renderItem={item => (
                      <List.Item>
                          <Card title={item}>Card content</Card>
                      </List.Item>
                  )}
            />
            <List
                  dataSource={lastGrades.slice(0, 5)}
                  size="small"
                    header={<h2>Last grades</h2>}
                  renderItem={item => (
                      <List.Item>
                          <List.Item.Meta
                              title={`Ви отримали оцінку ${item.grade} з предмету ${item.subject}, ${item.task}`}
                              description={generateDescription(item)}
                          />
                      </List.Item>
                  )}
            />
        </>
    );
}

function generateDescription(item: { subject?: string; task?: string; grade?: number; when: any; teacherName: any; }) {
    const timeDifference = Date.now() - item.when;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const secondsDifference = Math.floor(timeDifference / 1000);

    let timeAgo;
    if (daysDifference < 1) {
        timeAgo = minutesDifference < 1 ? `${secondsDifference} seconds ago` : `${minutesDifference} minutes ago`;
    } else {
        timeAgo = `${daysDifference} days ago`;
    }

    return `${item.teacherName} ${new Date(item.when).toLocaleDateString()} (${timeAgo})`;
}