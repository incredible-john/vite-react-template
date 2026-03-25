import { getChallengeTargetLang } from "./challengeLanguages";
import { extractWords } from "./textSegmentation";
import type { Challenge, ChallengeOption } from "./types";

export type TranslationAssemblyOption = Pick<ChallengeOption, "id" | "order" | "text">;

export function getDerivedTranslationAssemblyOptions(challenge: Challenge): TranslationAssemblyOption[] {
	const targetLang = getChallengeTargetLang(challenge);
	const parts = challenge.translation ? extractWords(challenge.translation, targetLang) : [];

	return parts.map((text, order) => ({
		id: -(challenge.id * 100 + order + 1),
		order,
		text,
	}));
}

export function getTranslationAssemblyWordBank(challenge: Challenge): TranslationAssemblyOption[] {
	switch (getChallengeTargetLang(challenge)) {
		case "zh":
			return challenge.options;
		case "en":
			return getDerivedTranslationAssemblyOptions(challenge);
	}
}
