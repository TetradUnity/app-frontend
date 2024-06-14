import {IUser} from "@/types/api.types";

export const tempTeachers : IUser[] = [
    {
        id: 1,
        first_name: "Максим",
        last_name: "Янов",
        email: "",
        role: "TEACHER",
        avatar: "https://i.pravatar.cc/256"
    }
]

export const tempStudents : IUser[] = [
    {
        id: 8,
        first_name: "Борис",
        last_name: "Васильков",
        email: "",
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/254"
    },
    {
        id: 2,
        first_name: "Тарас",
        last_name: "Квас",
        email: "",
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/257"
    },
    {
        id: 3,
        first_name: "Ольга",
        last_name: "Хрещатик",
        email: "",
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/255"
    },
    {
        id: 4,
        first_name: "Володимир",
        last_name: "Винниченко",
        email: "",
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/128"
    },
    {
        id: 5,
        first_name: "Роман",
        last_name: "Кошик",
        email: "",
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/256"
    },
    {
        id: 6,
        first_name: "Яна",
        last_name: "Ковальчук",
        email: "",
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/512"
    },
    {
        id: 7,
        first_name: "Софія",
        last_name: "Ковальчук",
        email: "",
        role: "STUDENT",
        avatar: "https://i.pravatar.cc/256"
    }
]

export const tempSubjects: TemporaryAnnoncedSubjectInfo[] = [
    {
        id: 1,
        title: "Математика",
        teacher_id: 1,
        description: "Лорем ипсум долор сит амет, ан перицула цонсеяуунтур цум. Пер елит реяуе анциллае ат, усу ан ностер петентиум. Муциус модератиус мел но, ерудити опортере ех меа, не дицат неглегентур еум. Темпор витуператорибус но еум. Ест ут мазим утинам, еос ут лабитур десеруиссе. Хис ан цетерос петентиум, детрацто салутанди еи нам Суммо перицулис репрехендунт ад вих. Сит ат цонсул доцтус аппареат, ат вим яуандо интеллегебат, ан еам делецтус инимицус. Еа вис омнис делицата реферрентур, иллуд пхаедрум ут дуо. Вим ех дицерет адиписцинг. Яуо те яуидам ностро, ут вих путент цаусае, но порро нонумес урбанитас хас. Аугуе тимеам меи ад. Пер ет нумяуам молестиае. Лудус путант инцидеринт еум еу, одио елеифенд дефинитионес ех вис, вих ин елитр персиус фуиссет. Еи цаусае платонем ест.",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
        banner: "https://gstatic.com/classroom/themes/Honors.jpg",
        duration: "9 місяців + практика 1 місяць",
        timetable: "Заняття кожного четверга"
    },
    {
        id: 2,
        title: "Українська мова",
        teacher_id: 1,
        description: "Опис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предметуОпис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
        banner: "https://gstatic.com/classroom/themes/img_learnlanguage.jpg",
        duration: "9 місяців + практика 1 місяць",
        timetable: "заняття кожного четверга"
    },
    {
        id: 3,
        title: "Іноземна мова",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
        banner: "https://gstatic.com/classroom/themes/img_learnlanguage.jpg",
        duration: "9 місяців + практика 1 місяць",
        timetable: "заняття кожного четверга"
    },
    {
        id: 4,
        title: "Фізика",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
        banner: "https://gstatic.com/classroom/themes/img_read.jpg",
        duration: "9 місяців + практика 1 місяць",
        timetable: "заняття кожного четверга"
    },
    {
        id: 5,
        title: "Хімія",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
        banner: "https://gstatic.com/classroom/themes/img_backtoschool.jpg",
        duration: "9 місяців + практика 1 місяць",
        timetable: "заняття кожного четверга"
    },
    {
        id: 6,
        title: "Біологія",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
        banner: "https://gstatic.com/classroom/themes/Honors.jpg",
        duration: "9 місяців + практика 1 місяць",
        timetable: "заняття кожного четверга"
    },
    {
        id: 7,
        title: "Історія Державності та Культури України",
        teacher_id: 1,
        description: "Опис предмету",
        is_active: true,
        created_at: "2021-09-01T00:00:00",
        exam: null,
        exam_end_date: null,
        start_date: "2023-05-01T00:00:00",
        banner: "https://gstatic.com/classroom/themes/img_backtoschool.jpg",
        duration: "9 місяців + практика 1 місяць",
        timetable: "заняття кожного четверга"
    }
]