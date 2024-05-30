'use client'
import {Button, Layout, Result} from "antd";
import {Content} from "antd/es/layout/layout";

import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { CSSProperties, useEffect, useState } from "react";
import { UserService } from "@/services/user.service";
import { useProfileStore } from "@/stores/profileStore";
import { useAppStore } from "@/stores/appStore";
import { usePathname } from "next/navigation";
import { AuthTokensService } from "@/services/auth-token.service";

const contentStyle: CSSProperties = {
  width: 1200,
  margin: "20px auto",
  background: "rgb(28,28,28)",
  padding: 40,
  borderRadius: 10,
  boxShadow: "10px 10px 78px -19px rgba(20,20,20,0.9)",
  display: "block",
};

const NOT_REQUIRED_AUTH_URLS = ["/subjects", "/subject/announced/", "/test/"];

export default function ILayout({
                                    children,
                                }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isLoading, setIsLoading] = useAppStore(store => [store.isLoading, store.setLoading]);
    const [isFailedToLoad, setIsFailedToLoad] = useAppStore(store => [store.isFailedToLoad, store.setFailedToLoad]);

    const [isAppLoading, setAppLoading] = useState(true);

    const updateProfileStore = useProfileStore(selector => selector.updateProfile);

    const pathname = usePathname();

    useEffect(() => {
        let isNotRequired = false;
        for (let i = 0; i < NOT_REQUIRED_AUTH_URLS.length; i++) {
            if (pathname.startsWith(NOT_REQUIRED_AUTH_URLS[i])) {
                isNotRequired = true;
                break;
            }
        }

        if (isNotRequired && !AuthTokensService.getAuthToken()) {
            setAppLoading(false);
            return;
        }
        
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
                {(isAppLoading || isLoading) && <Spin
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
