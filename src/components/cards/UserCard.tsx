import Link from "next/link";
import Image from "antd/lib/image";
import styles from "./user.module.css";
import {IUser} from "@/types/api.types";

export default function UserCard({user}: { user: IUser }) {
    return (
        <Link className={styles.Card} href={"/profile/" + user.id} style={{
            background: "var(--foreground)",
            padding: "var(--gap)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "column",
            gap: "var(--gap)"
        }}>
            <Image preview={false}
                   src={user.avatar}
                   placeholder={
                       <div className={styles.Placeholder} style={{
                           width: 128,
                           height: 128,
                           borderRadius: "50%",
                           objectFit: "cover",
                           objectPosition: "center"
                       }}/>
                   }
                   style={{
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