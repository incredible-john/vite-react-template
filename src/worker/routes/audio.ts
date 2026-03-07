import { Hono } from "hono";
import type { AppEnv } from "../types";

const app = new Hono<{ Bindings: AppEnv }>();

app.get("/:key{.+}", async (c) => {
	const key = c.req.param("key");
	const object = await c.env.VOICE_BUCKET.get(key);

	if (!object) {
		return c.json({ error: "Audio not found" }, 404);
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set("etag", object.httpEtag);
	headers.set("cache-control", "public, max-age=31536000, immutable");

	const contentType = headers.get("content-type") || "audio/mpeg";
	headers.set("content-type", contentType);

	return new Response(object.body, { headers });
});

export default app;
