'use client'
import { useState } from "react";

import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

import { usePathname, useRouter } from "next/navigation";
import { useAccountStore } from "@/stores/accountStore";
import { studentSiderItems } from "@/components/i/students/StudentSiderItems";
import { teacherSiderItems } from "@/components/i/teacher/TeacherSiderItems";

export default function ILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isCollapsed, setCollapsed] = useState(false);

  const pathname = usePathname();

  const userRole = useAccountStore(state => state.role);
  const navButtons = userRole == "student" ? studentSiderItems : teacherSiderItems;

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
