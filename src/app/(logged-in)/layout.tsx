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
              {children}
          </Content>
      </Layout>
  );
}
