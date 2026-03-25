import type { Challenge, LanguageCode } from "./types";
import { getChallengeSourceLang, getChallengeTargetLang } from "./challengeLanguages";
import { extractWords } from "./textSegmentation";
import { getTranslationAssemblyWordBank } from "./translationAssembly";

export type TtsVariant = "normal" | "slow";

const audioBlobCache = new Map<string, string>();
const audioPendingCache = new Map<string, Promise<string | null>>();

export function buildTtsUrl(text: string, variant: TtsVariant = "normal"): string {
	const params = new URLSearchParams({ text });
	if (variant !== "normal") {
		params.set("variant", variant);
	}
	return `/api/audio/tts?${params.toString()}`;
}

async function preloadAudio(
	text: string,
	signal?: AbortSignal,
	variant: TtsVariant = "normal",
): Promise<string | null> {
	const url = buildTtsUrl(text, variant);
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

export function getCachedAudioUrl(text: string, variant: TtsVariant = "normal"): string | null {
	return audioBlobCache.get(buildTtsUrl(text, variant)) ?? null;
}

const translationCache = new Map<string, string>();
const translationPendingCache = new Map<string, Promise<string | null>>();

function getTranslationCacheKey(text: string, from: LanguageCode, to: LanguageCode): string {
	return `${from}:${to}:${text}`;
}

async function preloadTranslation(
	text: string,
	from: LanguageCode = "en",
	to: LanguageCode = "zh",
	signal?: AbortSignal,
): Promise<string | null> {
	const key = getTranslationCacheKey(text, from, to);
	if (translationCache.has(key)) return translationCache.get(key)!;
	if (translationPendingCache.has(key)) return translationPendingCache.get(key)!;

	const p = fetch(`/api/translate/translate?text=${encodeURIComponent(text)}&from=${from}&to=${to}`, { signal })
		.then(async (res) => {
			if (!res.ok) return null;
			const data = await res.json();
			if (data.translations && data.translations.length > 0) {
				translationCache.set(key, data.translations[0]);
				return data.translations[0] as string;
			}
			return null;
		})
		.catch(() => null)
		.finally(() => translationPendingCache.delete(key));
	translationPendingCache.set(key, p);
	return p;
}

export function getCachedTranslation(
	text: string,
	from: LanguageCode = "en",
	to: LanguageCode = "zh",
): string | null {
	return translationCache.get(getTranslationCacheKey(text, from, to)) ?? null;
}

export async function fetchTranslation(
	text: string,
	from: LanguageCode = "en",
	to: LanguageCode = "zh",
): Promise<string | null> {
	const key = getTranslationCacheKey(text, from, to);
	if (translationCache.has(key)) return translationCache.get(key)!;
	return preloadTranslation(text, from, to);
}

let preloadAbort: AbortController | null = null;

export function stopPreload(): void {
	if (preloadAbort) {
		preloadAbort.abort();
		preloadAbort = null;
	}
}

export function preloadChallenges(challenges: Challenge[]): void {
	stopPreload();
	const abort = new AbortController();
	preloadAbort = abort;
	const { signal } = abort;

	const sorted = [...challenges].sort((a, b) => a.order - b.order);

	(async () => {
		for (const c of sorted) {
			if (signal.aborted) return;

			await preloadAudio(c.question, signal);
			if (signal.aborted) return;

			if (c.type === "DICTATION_ASSEMBLY") {
				await preloadAudio(c.question, signal, "slow");
				if (signal.aborted) return;
			}

			const sourceLang = getChallengeSourceLang(c);
			const targetLang = getChallengeTargetLang(c);
			console.log("source_lang:", sourceLang);
			const words = extractWords(c.question, sourceLang);
			for (const word of words) {
				if (signal.aborted) return;
				await preloadAudio(word, signal);
			}
			for (const word of words) {
				if (signal.aborted) return;
				await preloadTranslation(word, sourceLang, targetLang, signal);
			}

			for (const opt of getTranslationAssemblyWordBank(c)) {
				if (signal.aborted) return;
				await preloadAudio(opt.text, signal);
			}
		}
	})();
}
