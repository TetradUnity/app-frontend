import UsersPage from "@/components/usersPage";
import {tempStudents} from "@/temporary/data";

export default function Students() {
    return <UsersPage title="Студенти" users={tempStudents} />;
}
