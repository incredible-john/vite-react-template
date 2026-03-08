import { useState, useCallback } from "react";
import type { Challenge } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { WordTile } from "./WordTile";

interface TranslateChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

export function TranslateChallenge({ challenge, onAnswer, answered }: TranslateChallengeProps) {
	const [selected, setSelected] = useState<number[]>([]);

	const options = challenge.options;

	const handleSelectFromBank = useCallback(
		(idx: number) => {
			if (answered) return;
			setSelected((prev) => [...prev, idx]);
		},
		[answered]
	);

	const handleRemoveFromAnswer = useCallback(
		(posInAnswer: number) => {
			if (answered) return;
			setSelected((prev) => prev.filter((_, i) => i !== posInAnswer));
		},
		[answered]
	);

	const currentAnswer = selected.map((i) => options[i].text).join("");

	const handleCheck = () => {
		onAnswer(currentAnswer);
	};

	return (
		<div className="flex flex-col flex-1">
			<div className="px-6 pt-4 pb-2">
				<h2 className="text-lg font-bold text-foreground mb-4">Translate this sentence</h2>

				{/* Character + speech bubble */}
				<div className="flex items-start gap-3 mb-6">
					<div className="flex-shrink-0 w-20 h-24 rounded-2xl bg-duo-purple/20 flex items-end justify-center overflow-hidden">
						<div className="w-12 h-16 rounded-t-full bg-duo-purple/60" />
					</div>
					<div className="flex items-center gap-2 bg-white border-2 border-border rounded-2xl px-4 py-3 shadow-sm relative">
						<AudioButton audioUrl={challenge.audioUrl} size="sm" />
						<span className="text-base font-medium">{challenge.question}</span>
					</div>
				</div>
			</div>

			{/* Answer area */}
			<div className="px-6 mb-4">
				<div className="min-h-[52px] flex flex-wrap gap-2 border-b-2 border-border pb-3 mb-1">
					{selected.map((optIdx, posInAnswer) => (
						<WordTile
							key={`answer-${posInAnswer}`}
							text={options[optIdx].text}
							variant="answer"
							onClick={() => handleRemoveFromAnswer(posInAnswer)}
							disabled={answered}
						/>
					))}
				</div>
			</div>

			{/* Word bank */}
			<div className="px-6 flex-1">
				<div className="flex flex-wrap gap-2 justify-center">
					{options.map((opt, idx) => (
						<WordTile
							key={opt.id}
							text={opt.text}
							selected={selected.includes(idx)}
							onClick={() => handleSelectFromBank(idx)}
							disabled={answered}
						/>
					))}
				</div>
			</div>

			{/* Check button */}
			{!answered && (
				<div className="px-6 py-4 mt-auto">
					<button
						onClick={handleCheck}
						disabled={selected.length === 0}
						className="w-full py-3 rounded-2xl text-white font-bold text-base border-b-4 border-duo-green-dark bg-duo-green transition-all active:scale-[0.98] active:border-b-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Check
					</button>
				</div>
			)}
		</div>
	);
}

export function getTranslateCorrectAnswer(challenge: Challenge): string {
	return challenge.options
		.filter((o) => o.isCorrect)
		.sort((a, b) => a.order - b.order)
		.map((o) => o.text)
		.join("");
}
