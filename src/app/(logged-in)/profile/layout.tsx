"use client"

import ProfileHead from "@/components/profile/ProfileHead";
import React from "react";
import { usePathname } from "next/navigation";
import { Layout } from "antd";

export default function ProfileLayout({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    return (
        <Layout style={{gap:'var(--gap)'}}>
            {pathname != '/profile/settings'
                ? <ProfileHead/> 
                : null
            }
            {children}
        </Layout>
    )
}