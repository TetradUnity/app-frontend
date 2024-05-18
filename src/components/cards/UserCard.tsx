import Link from "next/link";
import Image from "antd/lib/image";
import styles from "./user.module.css";

interface IUser {
    id: number,
    email: string,
    first_name: string | undefined,
    last_name: string | undefined,
    avatar: string,
    role: "chief_teacher" | "teacher" | "student"
}

export default function UserCard({user} : {user: IUser}) {
    return (
        <Link href={"/profile/"+user.id} style={{
            background: "var(--foreground)",
            padding: "var(--gap)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "column",
            gap: "var(--gap)"
        }}>
            <Image preview={false} src={user.avatar} style={{
                width: 128,
                height: 128,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center"
            }} alt="user avatar"/>
                <div className={styles.Name}>{user.first_name} {user.last_name}</div>
        </Link>
    );
}