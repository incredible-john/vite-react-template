export type ParsedWordPiece = { type: "word" | "space"; value: string };

const WORD_SEGMENTER_LOCALE = "en";

let cachedWordSegmenter: Intl.Segmenter | null | undefined;

function getWordSegmenter(): Intl.Segmenter | null {
	if (cachedWordSegmenter !== undefined) {
		return cachedWordSegmenter;
	}

	cachedWordSegmenter =
		typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
			? new Intl.Segmenter(WORD_SEGMENTER_LOCALE, { granularity: "word" })
			: null;

	return cachedWordSegmenter;
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

export function segmentText(text: string): ParsedWordPiece[] {
	const segmenter = getWordSegmenter();

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

export function extractWords(text: string): string[] {
	return segmentText(text)
		.filter((piece) => piece.type === "word")
		.map((piece) => piece.value);
}
