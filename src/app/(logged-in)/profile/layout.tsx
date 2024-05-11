import {Layout} from "antd";
import ProfileHead from "@/components/profile/ProfileHead";
import React from "react";

export default function ProfileLayout({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    )
}