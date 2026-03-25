import type { LessonWithChallenges } from "./types";

const MOCK_CREATED_AT = new Date("2026-03-24T00:00:00.000Z").toISOString();

export const translationAssemblyMockLesson: LessonWithChallenges = {
	id: -2,
	unitId: -1,
	title: "Translation Assembly Test",
	order: 0,
	createdAt: MOCK_CREATED_AT,
	challenges: [
		{
			id: -201,
			lessonId: -2,
			type: "TRANSLATE",
			question: "\u5979\u6b63\u5728\u8bfb\u4e00\u672c\u4e66\u3002",
			sentence: null,
			translation: "She is reading a book.",
			sourceLang: "zh",
			targetLang: "en",
			audioUrl: null,
			order: 0,
			createdAt: MOCK_CREATED_AT,
			options: [],
			tokens: [],
		},
		{
			id: -202,
			lessonId: -2,
			type: "TRANSLATE",
			question: "\u6211\u4eec\u660e\u5929\u53bb\u516c\u56ed\u3002",
			sentence: null,
			translation: "We will go to the park tomorrow.",
			sourceLang: "zh",
			targetLang: "en",
			audioUrl: null,
			order: 1,
			createdAt: MOCK_CREATED_AT,
			options: [],
			tokens: [],
		},
	],
};

export const dictationAssemblyMockLesson: LessonWithChallenges = {
	id: -1,
	unitId: -1,
	title: "Dictation Assembly Test",
	order: 0,
	createdAt: MOCK_CREATED_AT,
	challenges: [
		{
			id: -101,
			lessonId: -1,
			type: "DICTATION_ASSEMBLY",
			question: "She is reading a book.",
			sentence: null,
			translation: "\u5979\u6b63\u5728\u8bfb\u4e00\u672c\u4e66\u3002",
			sourceLang: "en",
			targetLang: "zh",
			audioUrl: null,
			order: 0,
			createdAt: MOCK_CREATED_AT,
			options: [],
			tokens: [],
		},
	],
};
