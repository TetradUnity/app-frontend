'use client';

import dayjs from "dayjs";
import { pluralize } from "./InternalizationUtils";

export const TIME_PLURAL = {
    MINUTES: ["хвилина", "хвилини", "хвилин"],
    HOURS: ["година", "години", "годин"],
    DAYS: ["день", "дня", "днів"],
    SECONDS: ["секунда", "секунди", "секунд"]
};

export function differenceBetweenTwoDatesInSec(d1: dayjs.ConfigType, d2: dayjs.ConfigType): number {
    return dayjs(d2).diff(
        dayjs(d1),
        "seconds"
    );
}

export function formatTimeInSeconds(seconds: number): string {
    let minutes = Math.round(seconds / 60);
    let hours = Math.round(minutes / 60);
    let days = Math.round(hours / 24);

    if (days > 0) {
        return pluralize(days, TIME_PLURAL.DAYS);
    }
    if (hours > 0) {
        return pluralize(hours, TIME_PLURAL.HOURS);
    }
    if (minutes > 0) {
        return pluralize(minutes, TIME_PLURAL.MINUTES);
    }

    return pluralize(seconds, TIME_PLURAL.SECONDS);
}