'use client'
import {Button, Layout, Progress, Result} from "antd";
import {Content} from "antd/es/layout/layout";

import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { UserService } from "@/services/user.service";
import { useProfileStore } from "@/stores/profileStore";
import { useAppStore } from "@/stores/appStore";
import { usePathname } from "next/navigation";
import { AuthTokensService } from "@/services/auth-token.service";
import { useUploadStore } from "@/stores/uploadStore";

import { motion } from "framer-motion";
import { AuthService } from "@/services/auth.service";

const NOT_REQUIRED_AUTH_URLS = ["/subjects", "/subject/announced/", "/exam/", "/profile/"];

const UploadProgressOuter = () => {
    const uploadStore = useUploadStore();

    const shouldShowText = uploadStore.error || (uploadStore.progress == 100)

    return (
        <motion.div
            className={"upload_outer" + (uploadStore.isVisible ? "" : " uo_hidden")}
            animate={{opacity: uploadStore.isVisible ? 1 : 0}}
            initial={{opacity: 0}}
        >
            <Progress
                percent={uploadStore.progress}
                type="circle"
                status={uploadStore.error ? "exception" : undefined}
            />

            <motion.div
                className="uo_error_wrapper"
                animate={{height: shouldShowText ? 30 : 0, opacity: shouldShowText ? 1 : 0}}
                transition={{type: "tween"}}
            >
                {uploadStore.error
                    ? <p>Щось пішло не так: {uploadStore.error}</p>
                    : <p>Файл завантажено  на сервер!</p>
                }
            </motion.div>
        </motion.div>
    )
}

export default function ILayout({
                                    children,
                                }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isLoading, setIsLoading] = useAppStore(store => [store.isLoading, store.setLoading]);
    const [isFailedToLoad, setIsFailedToLoad] = useAppStore(store => [store.isFailedToLoad, store.setFailedToLoad]);
    const [noAccess, setNoAccess] = useState(false);

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
        } else if (!isNotRequired && !AuthTokensService.getAuthToken()) {
            setAppLoading(false);
            setIsFailedToLoad(true);
            setNoAccess(true);
            return;
        }

        AuthService.isValidToken().then(response => {
            if (!response.success) {
                setAppLoading(false);
                setIsFailedToLoad(true);
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
        })
    }, []);

    return (
        <Layout style={{flex: 1}}>
            <Content>
                {(!isAppLoading && !isFailedToLoad) && children}
                {(!isAppLoading && !isFailedToLoad) && <UploadProgressOuter />}
                
                {(isAppLoading || isLoading) && <Spin
                    indicator={<LoadingOutlined style={{fontSize: 60}}/>}
                    spinning={true}
                    fullscreen
                    tip={<h1>Завантаження...</h1>}
                />}
                
                
                {(isFailedToLoad && !noAccess) &&
                    <Result
                        status="error"
                        title="Не вдалося завантажити сайт"
                        subTitle="Перевірте підключення до Інтернету або статус сервера."
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
                 {(isFailedToLoad && noAccess) &&
                    <Result
                        status="403"
                        title="У вас немає доступу до цієї сторінки"
                        subTitle="Щоб відкрити цю сторінку, вам потрібно увійти у свій обліковий запис."
                        extra={[
                            <Button
                                type="primary"
                                key="tryagain"
                                onClick={() => window.location.href = "/login"}
                            >
                                Авторизація
                            </Button>,
                        ]}
                    />
                }
            </Content>
        </Layout>
    );
}
