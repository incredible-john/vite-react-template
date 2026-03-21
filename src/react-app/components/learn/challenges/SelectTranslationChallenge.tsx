import { useState, useEffect, useMemo } from "react";
import type { Challenge } from "@/lib/types";
import { AudioButton } from "../AudioButton";
import { InteractiveWord } from "../InteractiveWord";
import { cn } from "@/lib/utils";
import { CheckButton } from "./CheckButton";
import { playTts, stopTts } from "@/lib/sounds";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

interface SelectTranslationChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

// Helper function to split text into words (uses split to avoid sticky-regex bugs)
function parseWords(text: string): Array<{ type: "word" | "space"; value: string }> {
	const parts = text.split(/(\s+)/);
	return parts
		.filter((p) => p.length > 0)
		.map((part) =>
			/^\s+$/.test(part) ? { type: "space" as const, value: part } : { type: "word" as const, value: part }
		);
}

export function SelectTranslationChallenge({
	challenge,
	onAnswer,
	answered,
}: SelectTranslationChallengeProps) {
	const [selectedId, setSelectedId] = useState<number | null>(null);

	// Shuffle options randomly
	const shuffledOptions = useMemo(
		() => shuffleArray(challenge.options),
		[challenge.options]
	);

	const selectedOption = shuffledOptions.find((o) => o.id === selectedId);

	// Auto-play question audio on mount
	useEffect(() => {
		playTts(`/api/audio/tts?text=${encodeURIComponent(challenge.question)}`);
		return () => stopTts();
	}, [challenge.question]);

	// Render text with interactive words
	const renderInteractiveText = (text: string) => {
		const parsed = parseWords(text);
		return parsed.map((item, idx) => {
			if (item.type === "space") {
				return <span key={idx}>{item.value}</span>;
			}
			return <InteractiveWord key={idx} word={item.value} className="text-base font-medium" />;
		});
	};

	return (
		<div className="flex flex-col flex-1">
			<div className="px-6 pt-4 pb-2">
				<h2 className="text-lg font-bold text-foreground mb-4">
					Select the correct translation
				</h2>

				<div className="flex items-start gap-3 mb-6">
					<div className="shrink-0 w-20 h-24 rounded-2xl bg-duo-orange/20 flex items-end justify-center overflow-hidden">
						<div className="w-12 h-16 rounded-t-full bg-duo-orange/60" />
					</div>
					<div className="flex items-center gap-2 bg-white border-2 border-border rounded-2xl px-4 py-3 shadow-sm">
						<AudioButton text={challenge.question} size="sm" />
						<span className="text-base font-medium">{renderInteractiveText(challenge.question)}</span>
					</div>
				</div>
			</div>

			<div className="px-6 flex-1 space-y-3">
				{shuffledOptions.map((opt) => (
					<button
						key={opt.id}
						onClick={() => !answered && setSelectedId(opt.id)}
						disabled={answered}
						className={cn(
							"w-full py-4 px-5 rounded-2xl border-2 text-base font-medium transition-all text-left",
							selectedId === opt.id
								? "border-duo-blue bg-duo-blue/5 text-duo-blue"
								: "border-border bg-white text-foreground hover:border-duo-gray-dark"
						)}
					>
						{opt.text}
					</button>
				))}
			</div>

			{!answered && (
				<CheckButton
					onClick={() => selectedOption && onAnswer(selectedOption.text)}
					disabled={!selectedId}
				/>
			)}
		</div>
	);
}

export function getSelectTranslationCorrectAnswer(challenge: Challenge): string {
	const correct = challenge.options.find((o) => o.isCorrect);
	return correct?.text ?? "";
}
