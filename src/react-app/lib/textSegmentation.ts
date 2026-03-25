import type { LanguageCode } from "./types";

export type ParsedWordPiece = { type: "word" | "space"; value: string };

const cachedWordSegmenters = new Map<LanguageCode, Intl.Segmenter | null>();

function getWordSegmenter(locale: LanguageCode): Intl.Segmenter | null {
	if (cachedWordSegmenters.has(locale)) {
		return cachedWordSegmenters.get(locale) ?? null;
	}

	console.log("getting word segmenter for locale:", locale);

	const segmenter =
		typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
			? new Intl.Segmenter(locale, { granularity: "word" })
			: null;

	cachedWordSegmenters.set(locale, segmenter);
	return segmenter;
}

function segmentTextWhitespaceFallback(text: string): ParsedWordPiece[] {
	const result: ParsedWordPiece[] = [];
	const wordRegex = /(\s+)/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = wordRegex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			const word = text.slice(lastIndex, match.index).trim();
			if (word) {
				result.push({ type: "word", value: word });
			}
		}

		if (match[1]) {
			result.push({ type: "space", value: match[1] });
		}

		lastIndex = wordRegex.lastIndex;
	}

	if (lastIndex < text.length) {
		const word = text.slice(lastIndex).trim();
		if (word) {
			result.push({ type: "word", value: word });
		}
	}

	return result;
}

export function segmentText(text: string, locale: LanguageCode = "en"): ParsedWordPiece[] {
	const segmenter = getWordSegmenter(locale);

	if (!segmenter) {
		return segmentTextWhitespaceFallback(text);
	}

	const result: ParsedWordPiece[] = [];

	for (const { segment, isWordLike } of segmenter.segment(text)) {
		if (segment.length === 0) continue;
		result.push({
			type: isWordLike ? "word" : "space",
			value: segment,
		});
	}

	return result;
}

export function extractWords(text: string, locale: LanguageCode = "en"): string[] {
	return segmentText(text, locale)
		.filter((piece) => piece.type === "word")
		.map((piece) => piece.value);
}
