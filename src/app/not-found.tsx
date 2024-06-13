'use client'

import Link from "next/link";
import styles from "./not-found.module.css";
import {useEffect} from "react";

export default function NotFound() {
    useEffect(() => {
        document.title = "404 - Сторінка не найдена";
    }, []);
    return (
        <div className={styles.container}>
            <h1 className={styles.text}>404</h1>
            <div>
                <h2 style={{fontSize:32,marginBottom:16, color:"#fff"}}>Сторінка не найдена</h2>
                <p className={styles.paragraph}>Сторінка не існує або була видалена.</p>
                <p className={styles.paragraph}>Перевірте правильність URL або перейдіть на <Link href="/">головну сторінку</Link>.</p>
            </div>
        </div>
    );
}