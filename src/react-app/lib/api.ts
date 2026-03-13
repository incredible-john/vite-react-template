import type { Subject, UnitWithLessons, LessonWithChallenges, Challenge, ChallengeOption } from "./types";

const BASE = "/api";

async function fetchJson<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`API error: ${res.status}`);
	return res.json() as Promise<T>;
}

async function fetchJsonWithMethod<T>(url: string, method: string, body?: unknown): Promise<T> {
	const res = await fetch(url, {
		method,
		headers: { "Content-Type": "application/json" },
		body: body ? JSON.stringify(body) : undefined,
	});
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

// Admin API functions

export function getUnits(subjectId?: number) {
	const url = subjectId ? `${BASE}/admin/units?subjectId=${subjectId}` : `${BASE}/admin/units`;
	return fetchJson<{ id: number; subjectId: number; title: string; description: string; order: number }[]>(url);
}

export function getLessons(unitId?: number) {
	const url = unitId ? `${BASE}/admin/lessons?unitId=${unitId}` : `${BASE}/admin/lessons`;
	return fetchJson<{ id: number; unitId: number; title: string; order: number }[]>(url);
}

export function getChallenges(lessonId?: number) {
	const url = lessonId ? `${BASE}/admin/challenges?lessonId=${lessonId}` : `${BASE}/admin/challenges`;
	return fetchJson<Challenge[]>(url);
}

export function getChallengeOptions(challengeId: number) {
	return fetchJson<ChallengeOption[]>(`${BASE}/admin/challenge-options?challengeId=${challengeId}`);
}

// Subject CRUD
export function createSubject(data: { title: string; description: string }) {
	return fetchJsonWithMethod<Subject>(`${BASE}/admin/subjects`, "POST", data);
}

export function updateSubject(id: number, data: { title?: string; description?: string; order?: number }) {
	return fetchJsonWithMethod<Subject>(`${BASE}/admin/subjects/${id}`, "PUT", data);
}

export function deleteSubject(id: number) {
	return fetchJsonWithMethod<{ success: boolean }>(`${BASE}/admin/subjects/${id}`, "DELETE");
}

// Unit CRUD
export function createUnit(data: { subjectId: number; title: string; description: string }) {
	return fetchJsonWithMethod<{ id: number; subjectId: number; title: string; description: string; order: number }>(`${BASE}/admin/units`, "POST", data);
}

export function updateUnit(id: number, data: { title?: string; description?: string; order?: number }) {
	return fetchJsonWithMethod<{ id: number; subjectId: number; title: string; description: string; order: number }>(`${BASE}/admin/units/${id}`, "PUT", data);
}

export function deleteUnit(id: number) {
	return fetchJsonWithMethod<{ success: boolean }>(`${BASE}/admin/units/${id}`, "DELETE");
}

// Lesson CRUD
export function createLesson(data: { unitId: number; title: string }) {
	return fetchJsonWithMethod<{ id: number; unitId: number; title: string; order: number }>(`${BASE}/admin/lessons`, "POST", data);
}

export function updateLesson(id: number, data: { title?: string; order?: number }) {
	return fetchJsonWithMethod<{ id: number; unitId: number; title: string; order: number }>(`${BASE}/admin/lessons/${id}`, "PUT", data);
}

export function deleteLesson(id: number) {
	return fetchJsonWithMethod<{ success: boolean }>(`${BASE}/admin/lessons/${id}`, "DELETE");
}

// Challenge CRUD
export function createChallenge(data: { lessonId: number; type: string; question: string }) {
	return fetchJsonWithMethod<Challenge>(`${BASE}/admin/challenges`, "POST", data);
}

export function updateChallenge(id: number, data: { question?: string; type?: string; order?: number }) {
	return fetchJsonWithMethod<Challenge>(`${BASE}/admin/challenges/${id}`, "PUT", data);
}

export function deleteChallenge(id: number) {
	return fetchJsonWithMethod<{ success: boolean }>(`${BASE}/admin/challenges/${id}`, "DELETE");
}

// Challenge Option CRUD
export function createChallengeOption(data: { challengeId: number; text: string; isCorrect: boolean }) {
	return fetchJsonWithMethod<ChallengeOption>(`${BASE}/admin/challenge-options`, "POST", data);
}

export function updateChallengeOption(id: number, data: { text?: string; isCorrect?: boolean; order?: number }) {
	return fetchJsonWithMethod<ChallengeOption>(`${BASE}/admin/challenge-options/${id}`, "PUT", data);
}

export function deleteChallengeOption(id: number) {
	return fetchJsonWithMethod<{ success: boolean }>(`${BASE}/admin/challenge-options/${id}`, "DELETE");
}
