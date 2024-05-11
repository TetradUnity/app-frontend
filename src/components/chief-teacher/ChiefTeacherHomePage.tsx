'use client'

import { useProfileStore } from "@/stores/profileStore";
import {Button, Card, List, Tooltip} from "antd";

import {SettingOutlined, PlusCircleFilled} from "@ant-design/icons"
import Link from "next/link";
import { TeacherCard } from "./TeacherCard";

export default function ChiefTeacherHomePage() {
    const [firstName, lastName] = useProfileStore(selector => [selector.first_name, selector.last_name]);

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

    const teacherimg = "https://bodimax-assets.s3.us-east-2.amazonaws.com/440952961_915186553746409_649678656544482446_n.jpg";
    const teachers = [
        {name: "Оксана Рахнянська", img: teacherimg},
        {name: "Тетяна Тримарук", img: teacherimg},
        {name: "Галина Михайлівна", img: teacherimg},
        {name: "Сергій Петрович", img: teacherimg},
        {name: "Вадим Володимирович", img: teacherimg}
    ];

    return (
        <>
            <h1 style={{marginBottom: 20}}>Доброго дня, {firstName} {lastName}!</h1>

            <Link style={{display: "block", marginLeft: "auto", width: "fit-content"}} href="/subjects/create">
                <Button type="primary" icon={<PlusCircleFilled />} >Створити предмет</Button>
            </Link>

            <List pagination={{pageSize: 8}}
                  header={<p style={{fontSize: 28}}>Предмети, добавлені вами в систему (N шт.):</p>}
                  split={false}
                  grid={{gutter: 16, column: 4}}
                  dataSource={subjects}
                  renderItem={item => (
                      <List.Item>
                          <Link key={item} href="/subjects/:id">
                            <Card
                                hoverable
                                cover={<img style={{height: 100, objectFit: "cover"}} alt="subject_cover" src="https://realkm.com/wp-content/uploads/2020/02/teacher-cartoon-board-chalkboard-class-person-1449505-pxhere.com_.jpg" />}
                                actions={[
                                    <Tooltip key="setting" title="Налаштування предмету">
                                            <Button onClick={(e) => {
                                                e.preventDefault();
                                                window?.open("/subjects/edit/:id", "_blank")?.focus();
                                            }} key="setting" shape="circle" type="text" icon={<SettingOutlined />} />
                                    </Tooltip>
                                ]}
                            >
                                <Card.Meta title={item} description="Препод" />
                            </Card>
                            </Link>
                      </List.Item>
                  )}
            />

            <List pagination={{pageSize: 8}}
                  header={<p style={{fontSize: 28}}>Вчителі, добавлені вами в систему (N осіб):</p>}
                  split={false}
                  grid={{gutter: 20, column: 1}}
                  dataSource={teachers}
                  renderItem={item => (
                      <List.Item>
                        <TeacherCard key={item.name} item={item} />
                      </List.Item>
                  )}
            />

        </>
    )
}