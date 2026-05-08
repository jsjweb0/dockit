import type { Resume } from "./resume.types";
import { defaultResume } from "./resume.defaults";

const keyOf = (id: string) => `resume:${id}`;

export function loadResume(id: string): Resume {
    const raw = localStorage.getItem(keyOf(id));
    if (!raw) return defaultResume();

    try {
        const parsed = JSON.parse(raw) as Resume;
        // 최소 안전장치: basics 없으면 기본값으로
        return parsed ?? defaultResume();
    } catch {
        return defaultResume();
    }
}

export function saveResume(id: string, resume: Resume) {
    localStorage.setItem(keyOf(id), JSON.stringify(resume));
}

export function resetResume(id: string) {
    localStorage.removeItem(keyOf(id));
}
