import { Hono } from "hono";
import { eq, asc } from "drizzle-orm";
import { getDb } from "../../db";
import * as schema from "../../db/schema";
import type { AppEnv } from "../types";

const app = new Hono<{ Bindings: AppEnv }>();

app.get("/:id", async (c) => {
	const db = getDb(c.env.DB);
	const lessonId = Number(c.req.param("id"));

	const [lesson] = await db
		.select()
		.from(schema.lessons)
		.where(eq(schema.lessons.id, lessonId))
		.limit(1);

	if (!lesson) {
		return c.json({ error: "Lesson not found" }, 404);
	}

	const allChallenges = await db
		.select()
		.from(schema.challenges)
		.where(eq(schema.challenges.lessonId, lessonId))
		.orderBy(asc(schema.challenges.order));

	const challengeIds = allChallenges.map((ch) => ch.id);

	let allOptions: (typeof schema.challengeOptions.$inferSelect)[] = [];
	let allTokens: (typeof schema.challengeTokens.$inferSelect)[] = [];

	if (challengeIds.length > 0) {
		const [opts, toks] = await Promise.all([
			db
				.select()
				.from(schema.challengeOptions)
				.orderBy(asc(schema.challengeOptions.order)),
			db
				.select()
				.from(schema.challengeTokens)
				.orderBy(asc(schema.challengeTokens.order)),
		]);
		allOptions = opts.filter((o) => challengeIds.includes(o.challengeId));
		allTokens = toks.filter((t) => challengeIds.includes(t.challengeId));
	}

	const challengesWithDetails = allChallenges.map((challenge) => ({
		...challenge,
		options: allOptions.filter((o) => o.challengeId === challenge.id),
		tokens: allTokens.filter((t) => t.challengeId === challenge.id),
	}));

	return c.json({
		...lesson,
		challenges: challengesWithDetails,
	});
});

export default app;
