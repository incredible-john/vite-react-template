import type { Challenge, LanguageCode } from "./types";

export const DEFAULT_SOURCE_LANG: LanguageCode = "en";
export const DEFAULT_TARGET_LANG: LanguageCode = "zh";

export function getChallengeSourceLang(challenge: Pick<Challenge, "sourceLang">): LanguageCode {
	return challenge.sourceLang ?? DEFAULT_SOURCE_LANG;
}

export function getChallengeTargetLang(challenge: Pick<Challenge, "targetLang">): LanguageCode {
	return challenge.targetLang ?? DEFAULT_TARGET_LANG;
}
