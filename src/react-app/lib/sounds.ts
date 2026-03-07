const CORRECT_SOUND = "/sounds/correct.mp3";
const INCORRECT_SOUND = "/sounds/incorrect.wav";

export function playCorrectSound(): void {
	const audio = new Audio(CORRECT_SOUND);
	audio.play().catch(() => {});
}

export function playIncorrectSound(): void {
	const audio = new Audio(INCORRECT_SOUND);
	audio.play().catch(() => {});
}
