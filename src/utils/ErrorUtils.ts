const SERVER_ERRORS = {
    "server_error": "помилка на сервері",
    "unknown_error": "невідома помилка",
    "no_permission": "ви не маєте доступу",
    "unauthorized": "ви не увійшли в систему",
    "incorrect_data": "неправильні дані",
    "error_time": "помилка з указанням часу",
    "teacher_not_exists": "вчитель з такою електронною адресою не існує",
    "incorrect_format_exam": "екзамен передано в некоректному форматі",
    "very_short": "дуже коротко",
    "late": "пізно",
    "you_already_tried": "ви вже спробували",
    "not_found": "не знайдено",
    "incorrect_link": "невірне посилання"
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