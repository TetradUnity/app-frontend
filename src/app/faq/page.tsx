import { Divider } from "antd";
import Link from "next/link";

export default function FaqPage() {
    return (
        <>
            <h1>Поширенні запитання</h1>

            <Divider />

            <ol style={{marginLeft: 20}}>
                <li>
                    <Link href="/faq/text_formatting">Форматування тексту</Link>
                </li>
            </ol>
        </>
    )
}