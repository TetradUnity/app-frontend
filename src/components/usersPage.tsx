'use client'
import {Button, Empty, Flex, Form, Input, Modal, Select, Space, Spin} from "antd";
import UserCard from "@/components/cards/UserCard";
import React, {useEffect, useState} from "react";
import {IUser} from "@/types/api.types";
import styles from "./users.module.css";
import {UserService} from "@/services/user.service";
import InfiniteScroll from "react-infinite-scroll-component";
import {PlusOutlined, UpOutlined} from "@ant-design/icons";

const pagination = 28;

interface UsersPageProps {
    title: string;
    type: "TEACHER" | "STUDENT";
}

export default function UsersPage({title, type}: UsersPageProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [users, setUsers] = useState<IUser[]>([]);

    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);

    const [page, setPage] = useState(1);

    const [showScrollToTop, setShowScrollToTop] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);

    const[firstNameCreate, setFirstNameCreate] = useState("");
    const[lastNameCreate, setLastNameCreate] = useState("");
    const[emailCreate, setEmailCreate] = useState("");
    const[passwordCreate, setPasswordCreate] = useState("");
    const[confirmPasswordCreate, setConfirmPasswordCreate] = useState("");
    const[roleCreate, setRoleCreate] = useState(type);

    const showModal = () => {
        setModalOpen(true);
    }

    const handleOk = () => {
        setModalOpen(false);
    }

    const handleCancel = () => {
        setModalOpen(false);
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        })
    }, [])

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
        })
        setLoading(false);
    }, []);

    const loadMore = () => {
        if (loading) return;

        setLoading(true);

        UserService.findUsers({
            first_name: firstName ? firstName.trim() : firstName,
            last_name: lastName ? lastName.trim() : lastName,
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
        setLoading(false);
    }

    const onSearch = () => {
        if (loading) return;

        setLoading(true);
        UserService.findUsers({
            first_name: firstName ? firstName.trim() : firstName,
            last_name: lastName ? lastName.trim() : lastName,
            role: type,
            limit: pagination,
            page: page
        }).then((response) => {
            if (response.success) {
                // @ts-ignore
                setUsers([...response.data]);
                setPage(1)
                // @ts-ignore
                setHasMore(response.data.length === pagination)
            }
        })
        setLoading(false);
    }

    return (
        <Flex vertical gap='var(--gap)'>
            <div className={styles.Header}>
                <div className={styles.head}>
                    <h3 style={{fontWeight: 450}}>{title}</h3>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={showModal} style={{
                        borderRadius: 50,
                        width: 32,
                        minWidth: 32,
                        height: 32,
                    }}/>
                </div>
                <Space.Compact style={{width: "100%"}}>
                    <Input placeholder="Прізвище" onChange={(e) => setLastName(e.target.value)} onPressEnter={onSearch}
                           style={{
                               width: "calc(100% - 16px)"
                           }}/>
                    <Input.Search placeholder="Ім'я" onChange={(e) => setFirstName(e.target.value)}
                                  onSearch={onSearch}/>
                </Space.Compact>

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
            {
                (users.length === 0 && !loading) && <Empty description="Користувачів не найдено"></Empty>
            }
            <div className={`${styles.ScrollToTopButton} ${showScrollToTop ? styles.SlideUp : ''}`}>
                <Button type="text" onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                        icon={<UpOutlined/>}
                        style={{
                            borderRadius: 50,
                            width: 38,
                            height: 38,
                            backgroundColor: "#121212",
                        }}/>
            </div>

            <Modal title="Додати користувача" open={modalOpen} footer={null} onCancel={handleCancel} onOk={handleOk}>
                <Form>
                    <Form.Item label="Ім'я" name="first_name" rules={[{required: true}]}>
                        <Input value={firstNameCreate} onChange={(e) => setFirstNameCreate(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Прізвище" name="last_name" rules={[{required: true}]}>
                        <Input value={lastNameCreate} onChange={(e) => setLastNameCreate(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{required: true}]}>
                        <Input value={emailCreate} onChange={(e) => setEmailCreate(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Пароль" name="password" rules={[{required: true}]}>
                        <Input.Password value={passwordCreate} onChange={(e) => setPasswordCreate(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Підтвердження паролю" name="confirm_password" rules={[{required: true}]}>
                        <Input.Password value={confirmPasswordCreate} onChange={(e) => setConfirmPasswordCreate(e.target.value)}/>
                    </Form.Item>
                    <Form.Item label="Роль" name="role" rules={[{required: true}]}>
                        <Select
                            placeholder={"Оберіть роль"}
                            value={roleCreate}
                            onChange={(value) => setRoleCreate(value)}
                        >
                            <Select.Option value="STUDENT">Студент</Select.Option>
                            <Select.Option value="TEACHER">Викладач</Select.Option>
                            <Select.Option value="CHIEF_TEACHER">Головний Викладач</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Додати</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Flex>

    );
}
