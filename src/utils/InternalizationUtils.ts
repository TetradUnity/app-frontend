'use client';

import { ICertificate, SubjectNamespace } from "@/types/api.types";

export function pluralize(count: number, words: string[]): string {
    var cases = [2, 0, 1, 1, 1, 2];
    return count + ' ' + words[ (count % 100 > 4 && count % 100 < 20) ? 2 : cases[ Math.min(count % 10, 5)] ];
}

export function translateGradeReason(type: SubjectNamespace.IGrade["reason"]) {
    if (type == "CONFERENCES") {
        return "участь в конференції";
    }

    if (type == "EDUCATION_MATERIAL") {
        return "навчальний матеріал";
    }

    return "тест"; 
}

export function translateCertificatyType(type: ICertificate["type"]) {
    if (type == "EXCELLENT_RESULTS") {
        return "За відмінні результати!";
    }

    if (type == "GOOD_RESULTS") {
        return "За гарні результати!";
    }
    
    return "За участь!"; 
}