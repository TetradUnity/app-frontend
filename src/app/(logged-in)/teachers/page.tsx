import UsersPage from "@/components/usersPage";
import {IUser} from "@/types/api.types";
import {tempTeachers} from "@/temporary/data";

export default function Teachers() {


    return <UsersPage title="Вчителі" users={tempTeachers} />;
}
