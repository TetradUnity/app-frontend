'use client'
import {Flex, Input, Space, Spin} from "antd";
import UserCard from "@/components/cards/UserCard";
import {useEffect, useState} from "react";
import {IUser} from "@/types/api.types";
import styles from "./users.module.css";
import {UserService} from "@/services/user.service";
import InfiniteScroll from "react-infinite-scroll-component";

const pagination = 28;

interface UsersPageProps {
    title: string;
    type: "TEACHER" | "STUDENT";
}

export default function UsersPage({title, type}: UsersPageProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [users, setUsers] = useState<IUser[]>([]);

    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);

    const [page, setPage] = useState(1);

    useEffect(() => {
        UserService.findUsers({
            first_name: firstName,
            last_name: lastName,
            role: type,
            limit: pagination,
            page: page
        }).then((response) => {
            if (response.success) {
                // @ts-ignore
                setUsers(response.data);
                setPage(1)
                // @ts-ignore
                setHasMore(response.data.length === pagination)
            }
            console.log(response.data)
        })
    }, []);

    const loadMore = () => {
        UserService.findUsers({
            first_name: firstName,
            last_name: lastName,
            role: type,
            limit: pagination,
            page: page + 1
        }).then((response) => {
            if (response.success) {
                // @ts-ignore
                setUsers([...users, ...response.data]);
                setPage(page + 1)
                // @ts-ignore
                setHasMore(response.data.length === pagination)
            }
        })
    }

    const onSearch = () => {
        UserService.findUsers({
            first_name: firstName,
            last_name: lastName,
            role: type,
            limit: pagination,
            page: 2
        }).then((response) => {
            if (response.success) {
                // @ts-ignore
                setUsers([...response.data]);
                setPage(1)
                // @ts-ignore
                setHasMore(response.data.length === pagination)
            }
        })
    }

    return (
        <Flex vertical gap='var(--gap)'>
            <div className={styles.Header}>
                <h3 style={{fontWeight: 450}}>{title}</h3>
                <Space.Compact style={{width: "100%"}}>
                    <Input placeholder="Прізвище" onChange={(e) => setFirstName(e.target.value)}/>
                    <Input.Search placeholder="Ім'я" onChange={(e) => setFirstName(e.target.value)}
                                  onSearch={onSearch}/>
                </Space.Compact>
                {page}
            </div>
            <InfiniteScroll next={loadMore} hasMore={hasMore} loader={<Spin>Завантаження...</Spin>}
                            dataLength={users.length} style={{width: "100%"}}
            >
                <div style={{
                    display: "grid",
                    gap: 'var(--gap)',
                    gridTemplateColumns: 'repeat(auto-fill,minmax(153px,1fr))',
                    gridAutoRows: "auto",
                }}>

                    {users.map((user, i) => (
                        <UserCard key={i} user={user}/>
                    ))}

                </div>
            </InfiniteScroll>
        </Flex>
    );
}
