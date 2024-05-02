'use client'
import { useState } from "react";

import { Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Footer } from "antd/es/layout/layout";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import {HomeOutlined, UserOutlined} from "@ant-design/icons";

import { usePathname, useRouter } from "next/navigation";

const navButtons: MenuItemType[] = [
  {label: "Головна", key: "home", icon: <HomeOutlined />},
  {label: "Акаунт", key: "account", icon: <UserOutlined />},
];

export default function ILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isCollapsed, setCollapsed] = useState(false);

  const pathname = usePathname();

  const onSelectedItem = ({key}: {key : string}) => {
    router.push("/i/" + key);
  }


  return (
      <Layout>
          <Sider theme="light" collapsible collapsed={isCollapsed} onCollapse={(value) => setCollapsed(value)}>
            <Menu onSelect={onSelectedItem} defaultSelectedKeys={[pathname.split('/')[2]]} mode="inline" items={navButtons} />
          </Sider>

          <Content style={{margin: "15px 16px"}}>
            <div style={{background: "#141414", borderRadius: 10, padding: 24, minHeight: 360}}>
              {children}
            </div>
          </Content>
      </Layout>
  );
}
