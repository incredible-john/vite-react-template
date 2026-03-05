import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

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

export type ChallengeType =
	| "TRANSLATE"
	| "FILL_BLANK"
	| "MATCH_PAIRS"
	| "SELECT_TRANSLATION";

export const challenges = sqliteTable("challenges", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	lessonId: integer("lesson_id")
		.notNull()
		.references(() => lessons.id, { onDelete: "cascade" }),
	type: text("type").notNull().$type<ChallengeType>(),
	question: text("question").notNull(),
	audioUrl: text("audio_url"),
	order: integer("order").notNull().default(0),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
});

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
