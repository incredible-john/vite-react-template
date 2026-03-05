import { Hono } from "hono";
import { eq, asc } from "drizzle-orm";
import { getDb } from "../../db";
import * as schema from "../../db/schema";
import type { AppEnv } from "../types";

const app = new Hono<{ Bindings: AppEnv }>();

app.get("/", async (c) => {
	const db = getDb(c.env.DB);
	const allSubjects = await db
		.select()
		.from(schema.subjects)
		.orderBy(asc(schema.subjects.order));
	return c.json(allSubjects);
});

app.get("/:id/units", async (c) => {
	const db = getDb(c.env.DB);
	const subjectId = Number(c.req.param("id"));

	const allUnits = await db
		.select()
		.from(schema.units)
		.where(eq(schema.units.subjectId, subjectId))
		.orderBy(asc(schema.units.order));

	const unitIds = allUnits.map((u) => u.id);

	let allLessons: (typeof schema.lessons.$inferSelect)[] = [];
	if (unitIds.length > 0) {
		allLessons = await db
			.select()
			.from(schema.lessons)
			.orderBy(asc(schema.lessons.order));
		allLessons = allLessons.filter((l) => unitIds.includes(l.unitId));
	}

	const unitsWithLessons = allUnits.map((unit) => ({
		...unit,
		lessons: allLessons.filter((l) => l.unitId === unit.id),
	}));

	return c.json(unitsWithLessons);
});

export default app;
