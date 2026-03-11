let currentTtsAudio: HTMLAudioElement | null = null;

export function playTts(url: string): HTMLAudioElement {
	if (currentTtsAudio) {
		currentTtsAudio.pause();
		currentTtsAudio = null;
	}
	const audio = new Audio(url);
	currentTtsAudio = audio;
	audio.addEventListener("ended", () => {
		if (currentTtsAudio === audio) currentTtsAudio = null;
	});
	audio.addEventListener("error", () => {
		if (currentTtsAudio === audio) currentTtsAudio = null;
	});
	audio.play().catch(() => {});
	return audio;
}

export function stopTts(): void {
	if (currentTtsAudio) {
		currentTtsAudio.pause();
		currentTtsAudio = null;
	}
}

const CORRECT_SOUND = "/sounds/correct.mp3";
const INCORRECT_SOUND = "/sounds/incorrect.wav";
const FINISH_SOUND = "/sounds/finish.mp3";

const correctAudio = new Audio(CORRECT_SOUND);
export function playCorrectSound(): void {
	correctAudio.play().catch(() => {});
}

const incorrectAudio = new Audio(INCORRECT_SOUND);
export function playIncorrectSound(): void {
	incorrectAudio.play().catch(() => {});
}

const finishAudio = new Audio(FINISH_SOUND);
export function playFinishSound(): void {
	finishAudio.play().catch(() => {});
}
