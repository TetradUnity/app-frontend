'use client'
import {Avatar, Card, Flex, Input} from "antd";
import {SearchOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";

export default function Students() {
    return (
        <Flex vertical gap='var(--gap)'>
            <Flex gap='var(--gap)' style={{
                background: 'var(--foreground)',
                padding: "12px 16px",
                borderRadius: 8,
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <span>Студенти</span>
                <Input prefix={<SearchOutlined/>} placeholder="Пошук студентів"/>
            </Flex>
            {/*list of students*/}
            <div style={{
                display: "grid",
                gap: 'var(--gap)',
                gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))',
                gridAutoRows: "auto",
            }}>
                {new Array(39).fill(0).map((_, i) => (
                    <Card key={i} style={{borderRadius: 8, maxWidth: "100%", display: "block"}}>
                        <Flex vertical align="center">
                            <Link href={"/students/{i}"}>
                                <Avatar size={64} icon={<Avatar size={64} icon={<UserOutlined/>}/>}/>
                            </Link>
                            <Link href={"/students/{i}"}><strong>Ім'я Прізвище</strong></Link>
                        </Flex>
                    </Card>
                ))}

            </div>
        </Flex>
    );
}