'use client'
import { Button, Layout, Result } from "antd";
import { Content } from "antd/es/layout/layout";

import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { ProfileService } from "@/services/profile.service";

export default function ILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isLoading = useAppStore(state => state.isLoading);
  const [isAppLoading, setAppLoading] = useState(true);

  const [isFailedToLoad, setIsFailedToLoad] = useState(false);

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      ProfileService.getProfile().then(response => {
        setAppLoading(false);
        if (!response.success) {
          setIsFailedToLoad(true);
          return;
        }

      })
    }
  }, []);

  return (
      <Layout>
          <Content style={{margin: "15px 16px"}}>
          {(!isAppLoading && !isFailedToLoad) ? 
            <div style={{background: "#141414", borderRadius: 10, padding: 24, minHeight: 360}}>
              {children}
            </div>
            : null}
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 60 }}/>}
            spinning={isAppLoading || isLoading}
            fullscreen
            tip={<h1>Завантаження...</h1>}
          />

          {isFailedToLoad ? 
            <Result
              status="error"
              title="Не вдалося завантажити сайт"
              subTitle="Провірте підключення до інтернету або статус серверу."
              extra={[
                <Button
                  type="primary"
                  key="tryagain"
                  onClick={() => window.location.href = window.location.href}
                >
                  Спробувати ще раз
                </Button>,
              ]}
            />
          : null}

          </Content>
      </Layout>
  );
}
