export type { ChallengeType, ChallengeTokenType, LanguageCode } from "../../db/schema";

export type Subject = typeof import("../../db/schema").subjects.$inferSelect;

export type Unit = typeof import("../../db/schema").units.$inferSelect;

export type Lesson = typeof import("../../db/schema").lessons.$inferSelect & {
	/** 登录后由 /subjects/:id/units 返回：该课下所有 challenge 均已完成 */
	completed?: boolean;
};

export type UnitWithLessons = Unit & {
	lessons: Lesson[];
};

export type ChallengeOption = typeof import("../../db/schema").challengeOptions.$inferSelect;

export type ChallengeToken = typeof import("../../db/schema").challengeTokens.$inferSelect;

export type Challenge = typeof import("../../db/schema").challenges.$inferSelect & {
	options: ChallengeOption[];
	tokens: ChallengeToken[];
};

export type LessonWithChallenges = Lesson & {
	challenges: Challenge[];
};
