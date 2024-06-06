const SERVER_ERRORS = {
    "server_error": "Помилка на сервері",
    "unknown_error": "Невідома помилка"
} as const;

type ServerErrorKey = keyof typeof SERVER_ERRORS

export default function translateRequestError(error: ServerErrorKey | string) {
    if (error in SERVER_ERRORS) {
        return SERVER_ERRORS[error as ServerErrorKey];
    }

    return SERVER_ERRORS.unknown_error;
}