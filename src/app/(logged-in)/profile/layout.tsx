"use client"

import ProfileHead from "@/components/profile/ProfileHead";
import React from "react";
import { usePathname } from "next/navigation";

export default function ProfileLayout({
                                          children,
                                      }: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    return (
        <>
        {pathname != '/profile/settings'
            ? <ProfileHead/> 
            : null
        }

            {children}
        </>
    )
}