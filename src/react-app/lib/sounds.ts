const CORRECT_SOUND = "/sounds/correct.mp3";
const INCORRECT_SOUND = "/sounds/incorrect.wav";
const FINISH_SOUND = "/sounds/finish.mp3";

export function playCorrectSound(): void {
	const audio = new Audio(CORRECT_SOUND);
	audio.play().catch(() => {});
}

export function playIncorrectSound(): void {
	const audio = new Audio(INCORRECT_SOUND);
	audio.play().catch(() => {});
}

export function playFinishSound(): void {
	const audio = new Audio(FINISH_SOUND);
	audio.play().catch(() => {});
}
