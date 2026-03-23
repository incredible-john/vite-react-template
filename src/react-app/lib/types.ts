export interface Subject {
	id: number;
	title: string;
	description: string;
	imageUrl: string | null;
	order: number;
	createdAt: string;
}

export interface Unit {
	id: number;
	subjectId: number;
	title: string;
	description: string;
	order: number;
	createdAt: string;
}

export interface Lesson {
	id: number;
	unitId: number;
	title: string;
	order: number;
	createdAt: string;
	/** 登录后由 /subjects/:id/units 返回：该课下所有 challenge 均已完成 */
	completed?: boolean;
}

export interface UnitWithLessons extends Unit {
	lessons: Lesson[];
}

export type ChallengeType =
	| "TRANSLATE"
	| "FILL_BLANK"
	| "MATCH_PAIRS"
	| "SELECT_TRANSLATION"
	| "VERB_CONJUGATION";

export type ChallengeTokenType = "token" | "punctuation";

export interface ChallengeOption {
	id: number;
	challengeId: number;
	text: string;
	isCorrect: boolean;
	audioUrl: string | null;
	order: number;
}

export interface ChallengeToken {
	id: number;
	challengeId: number;
	type: ChallengeTokenType;
	text: string;
	translation: string | null;
	audioUrl: string | null;
	order: number;
}

export interface Challenge {
	id: number;
	lessonId: number;
	type: ChallengeType;
	question: string;
	sentence: string | null;
	translation: string | null;
	audioUrl: string | null;
	order: number;
	createdAt: string;
	options: ChallengeOption[];
	tokens: ChallengeToken[];
}

export interface LessonWithChallenges extends Lesson {
	challenges: Challenge[];
}
