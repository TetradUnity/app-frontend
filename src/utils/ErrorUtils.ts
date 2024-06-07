const SERVER_ERRORS = {
    "server_error": "Помилка на сервері",
    "unknown_error": "Невідома помилка",
    "no_permission": "У вас немає доступу",
    "unathorized": "Ви не увійшли в систему",
    "incorrect_data": "Неправильні дані",
    "error_time": "Помилка з указанням часу",
    "teacher_not_exists": "Вчитель з таким email не існує",
    "incorrect_format_exam": "Екзамен переданий в некоректній формі",
    "very_short": "Дуже коротко"

} as const;

type ServerErrorKey = keyof typeof SERVER_ERRORS

export default function translateRequestError(error: ServerErrorKey | string | undefined) {
    if (error == undefined) {
        return "<:";
    }

    if (error in SERVER_ERRORS) {
        return SERVER_ERRORS[error as ServerErrorKey];
    }

    return `${SERVER_ERRORS.unknown_error} (${error})`;
}