import { eq } from "drizzle-orm";
import type { Database } from "../../db";
import * as schema from "../../db/schema";
import type { ChallengeTokenType, ChallengeType } from "../../db/schema";

type ImportHttpStatus = 400 | 404 | 500;

export class ImportUnitError extends Error {
	constructor(
		message: string,
		public status: ImportHttpStatus = 400,
	) {
		super(message);
		this.name = "ImportUnitError";
	}
}

/** POST /units/import JSON body (export shape); assumed complete. */
export type UnitImportBody = {
	subjectId: number;
	title: string;
	description?: string;
	order?: number;
	lessons: Array<{
		title: string;
		challenges?: Array<{
			type: string;
			question: string;
			sentence?: string | null;
			translation?: string | null;
			options?: Array<{ text: string; isCorrect: boolean }>;
			tokens?: Array<{ type?: string; text: string; translation?: string | null }>;
		}>;
	}>;
};

function normalizeTokenType(raw: string | undefined): ChallengeTokenType {
	return raw === "punctuation" ? "punctuation" : "token";
}

export async function importUnitFromPayload(db: Database, data: UnitImportBody) {
	const [sub] = await db
		.select({ id: schema.subjects.id })
		.from(schema.subjects)
		.where(eq(schema.subjects.id, data.subjectId))
		.limit(1);

	if (!sub) {
		throw new ImportUnitError(`Subject ${data.subjectId} not found`, 404);
	}

	const [unit] = await db
		.insert(schema.units)
		.values({
			subjectId: data.subjectId,
			title: data.title,
			description: data.description ?? ""
		})
		.returning();

	if (!unit) {
		throw new ImportUnitError("Failed to create unit", 500);
	}

	for (let li = 0; li < data.lessons.length; li++) {
		const les = data.lessons[li];
		const [lesson] = await db
			.insert(schema.lessons)
			.values({
				unitId: unit.id,
				title: les.title,
				order: li,
			})
			.returning();

		if (!lesson) {
			throw new ImportUnitError("Failed to create lesson", 500);
		}

		const challenges = les.challenges ?? [];
		for (let ci = 0; ci < challenges.length; ci++) {
			const ch = challenges[ci];
			const [challenge] = await db
				.insert(schema.challenges)
				.values({
					lessonId: lesson.id,
					type: ch.type as ChallengeType,
					question: ch.question,
					sentence: ch.sentence ?? null,
					translation: ch.translation ?? null,
					audioUrl: null,
					order: ci,
				})
				.returning();

			if (!challenge) {
				throw new ImportUnitError("Failed to create challenge", 500);
			}

			const options = ch.options ?? [];
			for (let oi = 0; oi < options.length; oi++) {
				const opt = options[oi];
				await db.insert(schema.challengeOptions).values({
					challengeId: challenge.id,
					text: opt.text,
					isCorrect: opt.isCorrect,
					audioUrl: null,
					order: oi,
				});
			}

			const tokens = ch.tokens ?? [];
			for (let ti = 0; ti < tokens.length; ti++) {
				const tok = tokens[ti];
				await db.insert(schema.challengeTokens).values({
					challengeId: challenge.id,
					type: normalizeTokenType(tok.type),
					text: tok.text,
					translation: tok.translation ?? null,
					audioUrl: null,
					order: ti,
				});
			}
		}
	}

	return unit;
}
