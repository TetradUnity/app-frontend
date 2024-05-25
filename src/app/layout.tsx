import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import BaseLayout from "./BaseLayout";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "TetradUnity Academy",
    description: "Generated by create next app",
};

export default function MainLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <BaseLayout>
            {children}
        </BaseLayout>
        </body>
        </html>
    );
}
