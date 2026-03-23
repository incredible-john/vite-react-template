import type { Challenge } from "./types";
import { extractWords } from "./textSegmentation";

// --- Audio cache: URL string → Blob URL ---
const audioBlobCache = new Map<string, string>();
const audioPendingCache = new Map<string, Promise<string | null>>();

function ttsUrl(text: string): string {
	return `/api/audio/tts?text=${encodeURIComponent(text)}`;
}

async function preloadAudio(text: string, signal?: AbortSignal): Promise<string | null> {
	const url = ttsUrl(text);
	if (audioBlobCache.has(url)) return audioBlobCache.get(url)!;
	if (audioPendingCache.has(url)) return audioPendingCache.get(url)!;

	const p = fetch(url, { signal })
		.then(async (res) => {
			if (!res.ok) return null;
			const blob = await res.blob();
			const blobUrl = URL.createObjectURL(blob);
			audioBlobCache.set(url, blobUrl);
			return blobUrl;
		})
		.catch(() => null)
		.finally(() => audioPendingCache.delete(url));
	audioPendingCache.set(url, p);
	return p;
}

/** Get cached blob URL for a TTS text, or null if not cached yet */
export function getCachedAudioUrl(text: string): string | null {
	return audioBlobCache.get(ttsUrl(text)) ?? null;
}

// --- Translation cache ---
const translationCache = new Map<string, string>();
const translationPendingCache = new Map<string, Promise<string | null>>();

async function preloadTranslation(word: string, signal?: AbortSignal): Promise<string | null> {
	if (translationCache.has(word)) return translationCache.get(word)!;
	if (translationPendingCache.has(word)) return translationPendingCache.get(word)!;

	const p = fetch(`/api/translate/translate?text=${encodeURIComponent(word)}&from=en&to=zh`, { signal })
		.then(async (res) => {
			if (!res.ok) return null;
			const data = await res.json();
			if (data.translations && data.translations.length > 0) {
				translationCache.set(word, data.translations[0]);
				return data.translations[0] as string;
			}
			return null;
		})
		.catch(() => null)
		.finally(() => translationPendingCache.delete(word));
	translationPendingCache.set(word, p);
	return p;
}

/** Get cached translation, or null */
export function getCachedTranslation(word: string): string | null {
	return translationCache.get(word) ?? null;
}

/** Fetch translation, using cache if available */
export async function fetchTranslation(word: string): Promise<string | null> {
	if (translationCache.has(word)) return translationCache.get(word)!;
	return preloadTranslation(word);
}

let preloadAbort: AbortController | null = null;

/** Stop all in-flight preload requests */
export function stopPreload(): void {
	if (preloadAbort) {
		preloadAbort.abort();
		preloadAbort = null;
	}
}

/** Preload all audio + translations for challenges, sequentially by challenge order.
 *  Within each challenge: full question audio first, then word audios, then translations,
 *  then option audios (for MATCH_PAIRS, VERB_CONJUGATION, etc.). */
export function preloadChallenges(challenges: Challenge[]): void {
	// Abort any previous preload session
	stopPreload();
	const abort = new AbortController();
	preloadAbort = abort;
	const { signal } = abort;

	const sorted = [...challenges].sort((a, b) => a.order - b.order);

	(async () => {
		for (const c of sorted) {
			if (signal.aborted) return;

			// 1. Full question audio (highest priority)
			await preloadAudio(c.question, signal);
			if (signal.aborted) return;

			// 2. Per-word audio + translations (shared with challenge word segmentation)
			const words = extractWords(c.question);
			for (const word of words) {
				if (signal.aborted) return;
				await preloadAudio(word, signal);
			}
			for (const word of words) {
				if (signal.aborted) return;
				await preloadTranslation(word, signal);
			}

			// 3. Option audios (important for MATCH_PAIRS, VERB_CONJUGATION, SELECT_TRANSLATION)
			for (const opt of c.options) {
				if (signal.aborted) return;
				await preloadAudio(opt.text, signal);
			}
		}
	})();
}
