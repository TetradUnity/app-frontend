'use client';

import dayjs from "dayjs";
import { pluralize } from "./InternalizationUtils";

export const TIME_PLURAL = {
    SECONDS: ["секунда", "секунди", "секунд"],
    MINUTES: ["хвилина", "хвилини", "хвилин"],
    HOURS: ["година", "години", "годин"],
    DAYS: ["день", "дня", "днів"],
    MONTHS: ["місяць", "місяця", "місяців"],
    YEARS: ["рік", "роки", "років"],
};

export function pad2Start(input: string | number): string {
    return new String(input).padStart(2, "0");
}

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
    let months = Math.round(days / 30);
    let years = Math.round(months / 12);

    if (years > 0) {
        return pluralize(years, TIME_PLURAL.YEARS);
    }
    if (months > 0) {
        return pluralize(months, TIME_PLURAL.MONTHS);
    }
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

export function formatTimeInSeconds2(sec: number): string {
    let seconds = sec % 60;
    let minutes = Math.floor(sec / 60) % 60;
    let hours = Math.floor(sec / 3600) % 24;

    if (hours > 0) {
        return `${pad2Start(hours)}:${pad2Start(minutes)}:${pad2Start(seconds)}`;
    }
    
    return `${pad2Start(minutes)}:${pad2Start(seconds)}`;
}