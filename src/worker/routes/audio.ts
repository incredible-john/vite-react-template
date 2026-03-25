import { Hono } from "hono";
import type { AppEnv } from "../types";

const VOICE_ID = "nmmIJ8k3ukOa1CSFlor3";
const ELEVENLABS_TTS_URL = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;

type TtsVariant = "normal" | "slow";

async function hashText(text: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(text.trim().toLowerCase());
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getTtsVariant(rawVariant: string | undefined): TtsVariant {
	return rawVariant === "slow" ? "slow" : "normal";
}

const app = new Hono<{ Bindings: AppEnv }>();

app.get("/tts", async (c) => {
	const text = c.req.query("text");
	const variant = getTtsVariant(c.req.query("variant"));
	if (!text || !text.trim()) {
		return c.json({ error: "Missing text parameter" }, 400);
	}

	const hash = await hashText(text);
	const key = `tts/${variant}/${hash}.mp3`;

	const cached = await c.env.VOICE_BUCKET.get(key);
	if (cached) {
		const headers = new Headers();
		cached.writeHttpMetadata(headers);
		headers.set("etag", cached.httpEtag);
		headers.set("cache-control", "public, max-age=31536000, immutable");
		headers.set("content-type", "audio/mpeg");
		return new Response(cached.body, { headers });
	}

	const ttsResponse = await fetch(
		`${ELEVENLABS_TTS_URL}?output_format=mp3_44100_128`,
		{
			method: "POST",
			headers: {
				"xi-api-key": c.env.ELEVENLABS_API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model_id: variant === "slow" ? "eleven_multilingual_v2" : "eleven_v3",
				text: text.trim(),
				voice_settings: {
					speed: variant === "slow" ? 0.7 : 1,
				},
			}),
		},
	);

	if (!ttsResponse.ok) {
		const errBody = await ttsResponse.text();
		return c.json({ error: `ElevenLabs API error: ${ttsResponse.status} ${errBody}` }, 502);
	}

	const buffer = await ttsResponse.arrayBuffer();

	await c.env.VOICE_BUCKET.put(key, buffer, {
		httpMetadata: { contentType: "audio/mpeg" },
	});

	return new Response(buffer, {
		headers: {
			"content-type": "audio/mpeg",
			"cache-control": "public, max-age=31536000, immutable",
		},
	});
});

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
