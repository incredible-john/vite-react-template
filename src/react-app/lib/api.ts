import type { Subject, UnitWithLessons, LessonWithChallenges, Challenge, ChallengeOption, LanguageCode } from "./types";

const BASE = "/api";

type GetToken = () => Promise<string | null>;

let _getToken: GetToken | null = null;

export function setGetToken(fn: GetToken) {
	_getToken = fn;
}

type FetchApiOptions = {
	method?: string;
	body?: unknown;
};

async function fetchApi<T>(url: string, options?: FetchApiOptions): Promise<T> {
	const method = options?.method ?? "GET";
	const headers: Record<string, string> = {};
	if (method !== "GET" && method !== "HEAD") {
		headers["Content-Type"] = "application/json";
	}
	if (_getToken) {
		const token = await _getToken();
		if (token) headers["Authorization"] = `Bearer ${token}`;
	}

	const body = options?.body;
	const res = await fetch(url, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	return res.json() as Promise<T>;
}

export function getSubjects() {
	return fetchApi<Subject[]>(`${BASE}/subjects`);
}

export function getUnitsForSubject(subjectId: number) {
	return fetchApi<UnitWithLessons[]>(`${BASE}/subjects/${subjectId}/units`);
}

export function getLesson(lessonId: number) {
	return fetchApi<LessonWithChallenges>(`${BASE}/lessons/${lessonId}`);
}

/** 将某道 challenge 标记为已完成（未登录则静默跳过） */
export async function markChallengeComplete(challengeId: number): Promise<void> {
	if (!_getToken) return;
	const token = await _getToken();
	if (!token) return;
	await fetchApi<{ ok: boolean; challengeId: number }>(
		`${BASE}/progress/challenges/${challengeId}/complete`,
		{ method: "POST" },
	);
}

// Admin API functions

export function getUnits(subjectId?: number) {
	const url = subjectId ? `${BASE}/admin/units?subjectId=${subjectId}` : `${BASE}/admin/units`;
	return fetchApi<{ id: number; subjectId: number; title: string; description: string; order: number }[]>(url);
}

export function getLessons(unitId?: number) {
	const url = unitId ? `${BASE}/admin/lessons?unitId=${unitId}` : `${BASE}/admin/lessons`;
	return fetchApi<{ id: number; unitId: number; title: string; order: number }[]>(url);
}

export function getChallenges(lessonId?: number) {
	const url = lessonId ? `${BASE}/admin/challenges?lessonId=${lessonId}` : `${BASE}/admin/challenges`;
	return fetchApi<Challenge[]>(url);
}

export function getChallengeOptions(challengeId: number) {
	return fetchApi<ChallengeOption[]>(`${BASE}/admin/challenge-options?challengeId=${challengeId}`);
}

// Subject CRUD
export function createSubject(data: { title: string; description: string }) {
	return fetchApi<Subject>(`${BASE}/admin/subjects`, { method: "POST", body: data });
}

export function updateSubject(id: number, data: { title?: string; description?: string; order?: number }) {
	return fetchApi<Subject>(`${BASE}/admin/subjects/${id}`, { method: "PUT", body: data });
}

export function deleteSubject(id: number) {
	return fetchApi<{ success: boolean }>(`${BASE}/admin/subjects/${id}`, { method: "DELETE" });
}

// Unit CRUD
export function createUnit(data: { subjectId: number; title: string; description: string }) {
	return fetchApi<{ id: number; subjectId: number; title: string; description: string; order: number }>(`${BASE}/admin/units`, { method: "POST", body: data });
}

export function updateUnit(id: number, data: { title?: string; description?: string; order?: number }) {
	return fetchApi<{ id: number; subjectId: number; title: string; description: string; order: number }>(`${BASE}/admin/units/${id}`, { method: "PUT", body: data });
}

export function deleteUnit(id: number) {
	return fetchApi<{ success: boolean }>(`${BASE}/admin/units/${id}`, { method: "DELETE" });
}

// Lesson CRUD
export function createLesson(data: { unitId: number; title: string }) {
	return fetchApi<{ id: number; unitId: number; title: string; order: number }>(`${BASE}/admin/lessons`, { method: "POST", body: data });
}

export function updateLesson(id: number, data: { title?: string; order?: number }) {
	return fetchApi<{ id: number; unitId: number; title: string; order: number }>(`${BASE}/admin/lessons/${id}`, { method: "PUT", body: data });
}

export function deleteLesson(id: number) {
	return fetchApi<{ success: boolean }>(`${BASE}/admin/lessons/${id}`, { method: "DELETE" });
}

// Challenge CRUD
export function createChallenge(data: {
	lessonId: number;
	type: string;
	question: string;
	sourceLang?: LanguageCode;
	targetLang?: LanguageCode;
}) {
	return fetchApi<Challenge>(`${BASE}/admin/challenges`, { method: "POST", body: data });
}

export function updateChallenge(id: number, data: {
	question?: string;
	type?: string;
	order?: number;
	sourceLang?: LanguageCode;
	targetLang?: LanguageCode;
}) {
	return fetchApi<Challenge>(`${BASE}/admin/challenges/${id}`, { method: "PUT", body: data });
}

export function deleteChallenge(id: number) {
	return fetchApi<{ success: boolean }>(`${BASE}/admin/challenges/${id}`, { method: "DELETE" });
}

// Challenge Option CRUD
export function createChallengeOption(data: { challengeId: number; text: string; isCorrect: boolean }) {
	return fetchApi<ChallengeOption>(`${BASE}/admin/challenge-options`, { method: "POST", body: data });
}

export function updateChallengeOption(id: number, data: { text?: string; isCorrect?: boolean; order?: number }) {
	return fetchApi<ChallengeOption>(`${BASE}/admin/challenge-options/${id}`, { method: "PUT", body: data });
}

export function deleteChallengeOption(id: number) {
	return fetchApi<{ success: boolean }>(`${BASE}/admin/challenge-options/${id}`, { method: "DELETE" });
}
