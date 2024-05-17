'use client'

import Link from "next/link";

export default function NotFound() {
    return (
        <div style={{
            display: "flex",
            position: "relative",
            zIndex: 10,
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
            width: "100%",
            height: "calc(100vh - 58px - var(--gap))",
            minHeight: "250px",
            minWidth: "500px",
        }}>
            <h1 style={{
                fontSize: 148,
                marginBottom: 0,
                marginRight: 28,
                paddingRight: 28,
                borderRight: "solid 1px #222",
                color: "var(--primary)",
            }}>404</h1>
            <div>
                <h2 style={{fontSize:32,marginBottom:16, color:"#fff"}}>Сторінка не найдена</h2>
                <p style={{fontSize:20, color:"#fff"}}>Сторінка не існує або була видалена.</p>
                <p style={{fontSize:20, color:"#fff"}}>Перевірте правильність URL або перейдіть на <Link href="/">головну сторінку</Link>.</p>
            </div>
        </div>
    );
}