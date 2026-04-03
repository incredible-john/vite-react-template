import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

export const subjects = sqliteTable("subjects", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	description: text("description").notNull().default(""),
	imageUrl: text("image_url"),
	order: integer("order").notNull().default(0),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
	units: many(units),
}));

export const units = sqliteTable("units", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	subjectId: integer("subject_id")
		.notNull()
		.references(() => subjects.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description").notNull().default(""),
	order: integer("order").notNull().default(0),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const unitsRelations = relations(units, ({ one, many }) => ({
	subject: one(subjects, {
		fields: [units.subjectId],
		references: [subjects.id],
	}),
	lessons: many(lessons),
}));

export const lessons = sqliteTable("lessons", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	unitId: integer("unit_id")
		.notNull()
		.references(() => units.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	order: integer("order").notNull().default(0),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
	unit: one(units, {
		fields: [lessons.unitId],
		references: [units.id],
	}),
	challenges: many(challenges),
}));

export type ChallengeType =
	| "TRANSLATE"
	| "FILL_BLANK"
	| "MATCH_PAIRS"
	| "SELECT_TRANSLATION"
	| "SINGLE_SELECT"
	| "VERB_CONJUGATION"
	| "DICTATION_ASSEMBLY";

export type LanguageCode = "en" | "zh";

export const challenges = sqliteTable("challenges", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	lessonId: integer("lesson_id")
		.notNull()
		.references(() => lessons.id, { onDelete: "cascade" }),
	type: text("type").notNull().$type<ChallengeType>(),
	question: text("question").notNull(),
	sentence: text("sentence"),
	translation: text("translation"),
	sourceLang: text("source_lang").notNull().default("en").$type<LanguageCode>(),
	targetLang: text("target_lang").notNull().default("zh").$type<LanguageCode>(),
	audioUrl: text("audio_url"),
	order: integer("order").notNull().default(0),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
});

export const challengeProgress = sqliteTable("challenge_progress", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id").notNull(),
	challengeId: integer("challenge_id")
		.references(() => challenges.id, { onDelete: "cascade" })
		.notNull(),
	completed: integer("completed", { mode: "boolean" }).notNull().default(false),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
	lesson: one(lessons, {
		fields: [challenges.lessonId],
		references: [lessons.id],
	}),
	options: many(challengeOptions),
	tokens: many(challengeTokens),
	challengeProgress: many(challengeProgress),
}));

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
	challenge: one(challenges, {
		fields: [challengeProgress.challengeId],
		references: [challenges.id],
	}),
}));

export const challengeOptions = sqliteTable("challenge_options", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	challengeId: integer("challenge_id")
		.notNull()
		.references(() => challenges.id, { onDelete: "cascade" }),
	text: text("text").notNull(),
	isCorrect: integer("is_correct", { mode: "boolean" }).notNull().default(false),
	audioUrl: text("audio_url"),
	order: integer("order").notNull().default(0),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
	challenge: one(challenges, {
		fields: [challengeOptions.challengeId],
		references: [challenges.id],
	}),
}));

export const challengeTokens = sqliteTable("challenge_tokens", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	challengeId: integer("challenge_id")
		.notNull()
		.references(() => challenges.id, { onDelete: "cascade" }),
	text: text("text").notNull(),
	translation: text("translation"),
	audioUrl: text("audio_url"),
	order: integer("order").notNull().default(0),
});

export const challengeTokensRelations = relations(challengeTokens, ({ one }) => ({
	challenge: one(challenges, {
		fields: [challengeTokens.challengeId],
		references: [challenges.id],
	}),
}));
