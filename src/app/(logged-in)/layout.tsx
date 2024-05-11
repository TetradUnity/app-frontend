'use client'
import {Button, Layout, Result} from "antd";
import {Content} from "antd/es/layout/layout";

import {Spin} from "antd";
import {LoadingOutlined} from '@ant-design/icons';
import {useEffect, useState} from "react";
import {UserService} from "@/services/user.service";
import {useProfileStore} from "@/stores/profileStore";

export default function ILayout({
                                    children,
                                }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isAppLoading, setAppLoading] = useState(true);

    const [isFailedToLoad, setIsFailedToLoad] = useState(false);

    const updateProfileStore = useProfileStore(selector => selector.updateProfile);

    useEffect(() => {
        UserService.getProfile().then(response => {
            updateProfileStore(response.data);
            setAppLoading(false);

            if (!response.success) {
                setIsFailedToLoad(true);
                return;
            }
        })
    }, []);

    return (
        <Layout style={{flex: 1}}>
            <Content>
                {!isAppLoading && !isFailedToLoad && children}
                {isAppLoading && <Spin
                    indicator={<LoadingOutlined style={{fontSize: 60}}/>}
                    spinning={true}
                    fullscreen
                    tip={<h1>Завантаження...</h1>}
                />}
                {isFailedToLoad &&
                    <Result
                        status="error"
                        title="Не вдалося завантажити сайт"
                        subTitle="Провірте підключення до інтернету або статус серверу."
                        extra={[
                            <Button
                                type="primary"
                                key="tryagain"
                                onClick={() => window.location.reload()}
                            >
                                Спробувати ще раз
                            </Button>,
                        ]}
                    />
                }
            </Content>
        </Layout>
    );
}
