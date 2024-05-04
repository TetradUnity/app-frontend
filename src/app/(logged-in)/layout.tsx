'use client'
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

export default function ILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <Layout>
          <Content style={{margin: "15px 16px"}}>
            <div style={{background: "#141414", borderRadius: 10, padding: 24, minHeight: 360}}>
              {children}
            </div>
          </Content>
      </Layout>
  );
}
