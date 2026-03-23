import { Hono } from "hono";
import { eq, asc } from "drizzle-orm";
import { getDb } from "../../db";
import * as schema from "../../db/schema";
import { importUnitFromPayload, ImportUnitError, type UnitImportBody } from "../lib/importUnit";

type ChallengeWithChildren = typeof schema.challenges.$inferSelect & {
	options: (typeof schema.challengeOptions.$inferSelect)[];
	tokens: (typeof schema.challengeTokens.$inferSelect)[];
};

type LessonWithChallenges = typeof schema.lessons.$inferSelect & {
	challenges: ChallengeWithChildren[];
};

type UnitWithLessons = typeof schema.units.$inferSelect & {
	lessons: LessonWithChallenges[];
};

/** Strip DB-only / ordering fields from relational export payload. */
function sanitizeUnitExportTree(unit: UnitWithLessons) {
	return {
		subjectId: unit.subjectId,
		title: unit.title,
		description: unit.description,
		lessons: unit.lessons.map((lesson) => ({
			title: lesson.title,
			challenges: lesson.challenges.map((ch) => ({
				type: ch.type,
				question: ch.question,
				sentence: ch.sentence,
				translation: ch.translation,
				options: ch.options.map((opt) => ({
					text: opt.text,
					isCorrect: opt.isCorrect,
				})),
				tokens: ch.tokens.map((tok) =>
					tok.type === "punctuation"
						? { type: "punctuation" as const, text: tok.text }
						: {
								type: "token" as const,
								text: tok.text,
								translation: tok.translation ?? null,
							},
				),
			})),
		})),
	};
}

const app = new Hono<{ Bindings: Env }>();

// --- Subjects CRUD ---

app.get("/subjects", async (c) => {
	const db = getDb(c.env.DB);
	const rows = await db.select().from(schema.subjects).orderBy(asc(schema.subjects.order));
	return c.json(rows);
});

app.post("/subjects", async (c) => {
	const db = getDb(c.env.DB);
	const body = await c.req.json();
	const [row] = await db.insert(schema.subjects).values(body).returning();
	return c.json(row, 201);
});

app.put("/subjects/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	const body = await c.req.json();
	const [row] = await db.update(schema.subjects).set(body).where(eq(schema.subjects.id, id)).returning();
	return c.json(row);
});

app.delete("/subjects/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	await db.delete(schema.subjects).where(eq(schema.subjects.id, id));
	return c.json({ success: true });
});

// --- Units CRUD ---

app.get("/units", async (c) => {
	const db = getDb(c.env.DB);
	const subjectId = c.req.query("subjectId");
	let query = db.select().from(schema.units).orderBy(asc(schema.units.order));
	if (subjectId) {
		query = query.where(eq(schema.units.subjectId, Number(subjectId))) as typeof query;
	}
	return c.json(await query);
});

/**
 * Import a unit tree (export JSON shape). Orders for lessons / challenges / options / tokens
 * follow array order in the payload. Query `subjectId` overrides body.subjectId when present.
 */
app.post("/units/import", async (c) => {
	const db = getDb(c.env.DB);
	let body: unknown;
	try {
		body = await c.req.json();
	} catch {
		return c.json({ error: "Invalid JSON body" }, 400);
	}

	const qSubject = c.req.query("subjectId");
	if (qSubject !== undefined && qSubject !== "") {
		const sid = Number(qSubject);
		if (!Number.isFinite(sid) || sid <= 0) {
			return c.json({ error: "Invalid subjectId query" }, 400);
		}
		if (body && typeof body === "object" && !Array.isArray(body)) {
			(body as Record<string, unknown>).subjectId = sid;
		}
	}

	try {
		const unit = await importUnitFromPayload(db, body as UnitImportBody);
		return c.json({ unit }, 201);
	} catch (e) {
		if (e instanceof ImportUnitError) {
			return c.json({ error: e.message }, e.status);
		}
		throw e;
	}
});

/** Full unit tree for backup / import (no user progress). */
app.get("/units/:id/export", async (c) => {
	const db = getDb(c.env.DB);
	const unitId = Number(c.req.param("id"));
	if (!Number.isFinite(unitId) || unitId <= 0) {
		return c.json({ error: "Invalid unit id" }, 400);
	}

	const unit = await db.query.units.findFirst({
		where: eq(schema.units.id, unitId),
		with: {
			lessons: {
				orderBy: (lessons, { asc: ascFn }) => [ascFn(lessons.order)],
				with: {
					challenges: {
						orderBy: (challenges, { asc: ascFn }) => [ascFn(challenges.order)],
						with: {
							options: {
								orderBy: (opts, { asc: ascFn }) => [ascFn(opts.order)],
							},
							tokens: {
								orderBy: (toks, { asc: ascFn }) => [ascFn(toks.order)],
							},
						},
					},
				},
			},
		},
	});

	if (!unit) {
		return c.json({ error: "Unit not found" }, 404);
	}

	const exportUnit = sanitizeUnitExportTree(unit as UnitWithLessons);

	const wantDownload = c.req.query("download");
	if (wantDownload === "1" || wantDownload === "true") {
		const body = JSON.stringify(exportUnit, null, 2);
		const filename = `unit-${unitId}-export.json`;
		return new Response(body, {
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Content-Disposition": `attachment; filename="${filename}"`,
			},
		});
	}

	return c.json(exportUnit);
});

app.post("/units", async (c) => {
	const db = getDb(c.env.DB);
	const body = await c.req.json();
	const [row] = await db.insert(schema.units).values(body).returning();
	return c.json(row, 201);
});

app.put("/units/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	const body = await c.req.json();
	const [row] = await db.update(schema.units).set(body).where(eq(schema.units.id, id)).returning();
	return c.json(row);
});

app.delete("/units/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	await db.delete(schema.units).where(eq(schema.units.id, id));
	return c.json({ success: true });
});

// --- Lessons CRUD ---

app.get("/lessons", async (c) => {
	const db = getDb(c.env.DB);
	const unitId = c.req.query("unitId");
	let query = db.select().from(schema.lessons).orderBy(asc(schema.lessons.order));
	if (unitId) {
		query = query.where(eq(schema.lessons.unitId, Number(unitId))) as typeof query;
	}
	return c.json(await query);
});

app.post("/lessons", async (c) => {
	const db = getDb(c.env.DB);
	const body = await c.req.json();
	const [row] = await db.insert(schema.lessons).values(body).returning();
	return c.json(row, 201);
});

app.put("/lessons/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	const body = await c.req.json();
	const [row] = await db.update(schema.lessons).set(body).where(eq(schema.lessons.id, id)).returning();
	return c.json(row);
});

app.delete("/lessons/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	await db.delete(schema.lessons).where(eq(schema.lessons.id, id));
	return c.json({ success: true });
});

// --- Challenges CRUD ---

app.get("/challenges", async (c) => {
	const db = getDb(c.env.DB);
	const lessonId = c.req.query("lessonId");
	let query = db.select().from(schema.challenges).orderBy(asc(schema.challenges.order));
	if (lessonId) {
		query = query.where(eq(schema.challenges.lessonId, Number(lessonId))) as typeof query;
	}
	return c.json(await query);
});

app.post("/challenges", async (c) => {
	const db = getDb(c.env.DB);
	const body = await c.req.json();
	const [row] = await db.insert(schema.challenges).values(body).returning();
	return c.json(row, 201);
});

app.put("/challenges/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	const body = await c.req.json();
	const [row] = await db.update(schema.challenges).set(body).where(eq(schema.challenges.id, id)).returning();
	return c.json(row);
});

app.delete("/challenges/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	await db.delete(schema.challenges).where(eq(schema.challenges.id, id));
	return c.json({ success: true });
});

// --- Challenge Options CRUD ---

app.get("/challenge-options", async (c) => {
	const db = getDb(c.env.DB);
	const challengeId = c.req.query("challengeId");
	let query = db.select().from(schema.challengeOptions).orderBy(asc(schema.challengeOptions.order));
	if (challengeId) {
		query = query.where(eq(schema.challengeOptions.challengeId, Number(challengeId))) as typeof query;
	}
	return c.json(await query);
});

app.post("/challenge-options", async (c) => {
	const db = getDb(c.env.DB);
	const body = await c.req.json();
	const [row] = await db.insert(schema.challengeOptions).values(body).returning();
	return c.json(row, 201);
});

app.put("/challenge-options/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	const body = await c.req.json();
	const [row] = await db.update(schema.challengeOptions).set(body).where(eq(schema.challengeOptions.id, id)).returning();
	return c.json(row);
});

app.delete("/challenge-options/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	await db.delete(schema.challengeOptions).where(eq(schema.challengeOptions.id, id));
	return c.json({ success: true });
});

// --- Challenge Tokens CRUD ---

app.get("/challenge-tokens", async (c) => {
	const db = getDb(c.env.DB);
	const challengeId = c.req.query("challengeId");
	let query = db.select().from(schema.challengeTokens).orderBy(asc(schema.challengeTokens.order));
	if (challengeId) {
		query = query.where(eq(schema.challengeTokens.challengeId, Number(challengeId))) as typeof query;
	}
	return c.json(await query);
});

app.post("/challenge-tokens", async (c) => {
	const db = getDb(c.env.DB);
	const body = await c.req.json();
	const [row] = await db.insert(schema.challengeTokens).values(body).returning();
	return c.json(row, 201);
});

app.put("/challenge-tokens/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	const body = await c.req.json();
	const [row] = await db.update(schema.challengeTokens).set(body).where(eq(schema.challengeTokens.id, id)).returning();
	return c.json(row);
});

app.delete("/challenge-tokens/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	await db.delete(schema.challengeTokens).where(eq(schema.challengeTokens.id, id));
	return c.json({ success: true });
});

export default app;
