'use client'
import {Flex, Input, Space} from "antd";
import UserCard from "@/components/cards/UserCard";
import {useState} from "react";
import {IUser} from "@/types/api.types";
import styles from "./users.module.css";
import {UserService} from "@/services/user.service";


interface UsersPageProps {
    title: string;
    type: "TEACHER" | "STUDENT";
}

export default function UsersPage({ title, type }: UsersPageProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [users, setUsers] = useState<IUser[]>([]);

    const [page, setPage] = useState(1);

    const onSearch = () => {
        UserService.findUsers({
            first_name: firstName,
            last_name: lastName,
            role: type,
            limit: 28,
            page: page
        }).then((response) => {
            if (response.success) {
                // @ts-ignore
                setUsers(response.data);
            }
        })
    }
    return (
        <Flex vertical gap='var(--gap)'>
            <div className={styles.Header}>
                <h3 style={{fontWeight: 450}}>{title}</h3>
                <Space.Compact style={{width:"100%"}}>
                    <Input placeholder="Прізвище" onChange={(e) => setFirstName(e.target.value)}/>
                    <Input.Search placeholder="Ім'я" onChange={(e) => setFirstName(e.target.value)} onSearch={onSearch}/>
                </Space.Compact>
            </div>
            <div style={{
                display: "grid",
                gap: 'var(--gap)',
                gridTemplateColumns: 'repeat(auto-fill,minmax(153px,1fr))',
                gridAutoRows: "auto",
            }}>
                {users.map((user, i) => (
                    <UserCard key={i} user={user} />
                ))}
            </div>
        </Flex>
    );
}
