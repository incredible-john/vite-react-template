import { getChallengeTargetLang } from "./challengeLanguages";
import { extractWords } from "./textSegmentation";
import type { Challenge, ChallengeOption } from "./types";

function isChinese(text: string): boolean {
	return /[\u4e00-\u9fa5]/.test(text);
}

function getTranslationAssemblyCorrectAnswer(challenge: Challenge): string {
	const targetLang = getChallengeTargetLang(challenge);

	if (targetLang === "zh") {
		return challenge.options
			.filter((option) => option.isCorrect)
			.sort((a, b) => a.order - b.order)
			.map((option) => option.text)
			.join(" ");
	}

	const parts = challenge.translation ? extractWords(challenge.translation, targetLang) : [];
	return parts.join(" ");
}

function getFillBlankCorrectAnswer(challenge: Challenge): string {
	const correct = challenge.options.find((option) => option.isCorrect);
	return correct?.text ?? "";
}

function getMatchPairsCorrectAnswer(challenge: Challenge): string {
	const chinese: ChallengeOption[] = [];
	const english: ChallengeOption[] = [];

	challenge.options.forEach((option) => {
		if (isChinese(option.text)) {
			chinese.push(option);
			return;
		}
		english.push(option);
	});

	return chinese.map((option, index) => `${option.id}-${english[index].id}`).join(",");
}

function getSelectTranslationCorrectAnswer(challenge: Challenge): string {
	const correct = challenge.options.find((option) => option.isCorrect);
	return correct?.text ?? "";
}

function getSingleSelectCorrectAnswer(challenge: Challenge): string {
	const correct = challenge.options.find((option) => option.isCorrect);
	return correct?.text ?? "";
}

function getVerbConjugationCorrectAnswer(challenge: Challenge): string {
	const chinese: ChallengeOption[] = [];
	const english: ChallengeOption[] = [];

	challenge.options.forEach((option) => {
		if (isChinese(option.text)) {
			chinese.push(option);
			return;
		}
		english.push(option);
	});

	return chinese
		.map((option, index) => `${option.text}=${english[index].text}`)
		.sort()
		.join(",");
}

function getDictationAssemblyCorrectAnswer(challenge: Challenge): string {
	return extractWords(challenge.question).join(" ");
}

export function getChallengeCorrectAnswer(challenge: Challenge): string {
	switch (challenge.type) {
		case "TRANSLATE":
			return getTranslationAssemblyCorrectAnswer(challenge);
		case "FILL_BLANK":
			return getFillBlankCorrectAnswer(challenge);
		case "MATCH_PAIRS":
			return getMatchPairsCorrectAnswer(challenge);
		case "SELECT_TRANSLATION":
			return getSelectTranslationCorrectAnswer(challenge);
		case "SINGLE_SELECT":
			return getSingleSelectCorrectAnswer(challenge);
		case "VERB_CONJUGATION":
			return getVerbConjugationCorrectAnswer(challenge);
		case "DICTATION_ASSEMBLY":
			return getDictationAssemblyCorrectAnswer(challenge);
	}
}
