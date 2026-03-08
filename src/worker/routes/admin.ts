import { Hono } from "hono";
import { eq, asc } from "drizzle-orm";
import { getDb } from "../../db";
import * as schema from "../../db/schema";

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
