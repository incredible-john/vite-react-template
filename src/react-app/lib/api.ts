import type { Subject, UnitWithLessons, LessonWithChallenges } from "./types";

const BASE = "/api";

async function fetchJson<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	return res.json() as Promise<T>;
}

export function getSubjects() {
	return fetchJson<Subject[]>(`${BASE}/subjects`);
}

export function getUnitsForSubject(subjectId: number) {
	return fetchJson<UnitWithLessons[]>(`${BASE}/subjects/${subjectId}/units`);
}

export function getLesson(lessonId: number) {
	return fetchJson<LessonWithChallenges>(`${BASE}/lessons/${lessonId}`);
}
