'use client'

import {Button, Flex, Image, message} from "antd";
import {Content} from "antd/es/layout/layout";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import styles from "./landing.module.css";
import {
    BookOutlined, ClusterOutlined, CommentOutlined,
    LockOutlined,
    MoreOutlined,
    PicLeftOutlined,
    StarOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";

export default function LandPage() {
    const searchParams = useSearchParams();

    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const err = searchParams.get("err");
    useEffect(() => {
        if (err) {
            messageApi.error(err);
            router.replace(location.pathname);
        }
    }, [err]);

    return (
        <Content>
            <div className={styles.container}>
                <section className={styles.main}>
                    <h1>Освітня Платформа для Сучасного Навчання</h1>
                    <p>Пропонуємо всі можливості та функціонал Moodle з додатковими інструментами для більш ефективного
                        навчання.</p>
                </section>

                <section className={styles.about}>
                    <h2>Хто Ми</h2>
                    <div>
                        <p>Ми - команда освітніх інноваторів, що прагне зробити навчання доступним та ефективним для
                            кожного. Наша платформа поєднує в собі найкращі практики дистанційного навчання з інтуїтивно
                            зрозумілим інтерфейсом та розширеними можливостями для викладачів і студентів.</p>
                    </div>
                </section>

                <section className={styles.features}>
                    <h2>Функціонал Платформи</h2>
                    <p>Наша освітня платформа включає такі ключові можливості:</p>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "36px",
                        padding: "16px 0"
                    }}>
                        <div className={styles.item}>
                            <BookOutlined className={styles.icon}/>
                            <h3>Курси та модулі</h3>
                            <p>Легке створення та управління курсами.</p>
                        </div>
                        <div className={styles.item}>
                            <StarOutlined className={styles.icon}/>
                            <h3>Оцінювання та тести</h3>
                            <p>Автоматичні тести та система оцінювання.</p>
                        </div>
                        <div className={styles.item}>
                            <VideoCameraOutlined className={styles.icon}/>
                            <h3>Підтримка відеозв&apos;язку</h3>
                            <p>Легке надання посилань на відеоконференції.</p>
                        </div>
                        <div className={styles.item}>
                            <MoreOutlined className={styles.icon}/>
                            <h3>Та багато іншого!</h3>
                        </div>
                    </div>
                </section>
                <section className={styles.advantages}>
                    <h2>Чому Обирають Нас</h2>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "var(--gap)",
                        padding: "16px 0"
                    }}>
                        <div className={styles.item}>
                            <PicLeftOutlined className={styles.icon}/>
                            <h3>Інтуїтивний інтерфейс</h3>
                            <p>Простий у використанні навіть для новачків.</p>
                        </div>
                        <div className={styles.item}>
                            <ClusterOutlined className={styles.icon}/>
                            <h3>Гнучкість</h3>
                            <p>Платформа підходить як для малих груп, так і для великих навчальних закладів.</p>
                        </div>
                        <div className={styles.item}>
                            <LockOutlined className={styles.icon}/>
                            <h3>Безпека</h3>
                            <p>Високий рівень захисту даних.</p>
                        </div>
                        <div className={styles.item}>
                            <CommentOutlined className={styles.icon}/>
                            <h3>Підтримка 24/7</h3>
                            <p>Наша команда підтримки завжди готова допомогти вам.</p>
                        </div>
                    </div>
                </section>
                <section className={styles.join}>
                    <div className={styles.joinText}>
                        <h2>Приєднуйтесь до Нас!</h2>
                        <p>Перегляньте курси та почніть використовувати нашу платформу вже сьогодні.</p>
                    </div>
                    <div style={{display:'flex', flexDirection:"column", marginTop: 50}}>
                        <Link href="/subjects" style={{width:"max-content"}}>
                            <button className={styles.joinButton}>Переглянути Курси</button>
                        </Link>
                        <Link href={"/login"} className={styles.loginLink}>Уже маєте акаунт?</Link>
                    </div>
                </section>
                <section className={styles.certificates}>
                    <div className={styles.imageWrapper}>
                        <Image src="imgs/landing/certificate-example.jpg" alt="Certificates" />
                    </div>
                    <div className={styles.certificatesDescription}>
                    <div className={styles.certificatesText}>
                        <h2>Система сертифікатів</h2>
                        <p>У нас є система сертифікатів, при закінченні курсу вони будуть відображатися в профілі.</p>
                    </div>
                    <Link href="/check-certificate">
                        <button className={styles.certificatesButton}>Провірити сертифікат</button>
                    </Link>
                    </div>
                </section>

                <section className={styles.footer}>
                    <p>© 2024 TetradUnity Academy</p>
                </section>
            </div>
            {contextHolder}
        </Content>
    );
}
