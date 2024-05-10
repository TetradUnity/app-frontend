'use client'

import {Card, List} from "antd";

export default function TeacherHomePage() {
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
    return (
        <div>
            <h1>Головна сторінка для викладача</h1>
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
        </div>
    )
}