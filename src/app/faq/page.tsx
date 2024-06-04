import Foreground from "@/components/Foreground";
import { Divider } from "antd";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";

export default function FaqPage() {
    return (
        <>
            <h1>Часті запитання</h1>

            <Divider />

            <ol style={{marginLeft: 20}}>
                <li>
                    <Link href="/faq/text_formatting">Форматування тексту</Link>
                </li>
            </ol>

            <Divider />
            <p style={{textAlign: "center", color: "rgb(200,200,200)"}}>Якщо є запитання, яких немає тут, присилайте їх нам на почту.</p>
        </>
    )
}