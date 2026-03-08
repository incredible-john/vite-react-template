import { useState } from "react";
import type { Challenge } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { cn } from "@/lib/utils";

interface SelectTranslationChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

export function SelectTranslationChallenge({
	challenge,
	onAnswer,
	answered,
}: SelectTranslationChallengeProps) {
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const selectedOption = challenge.options.find((o) => o.id === selectedId);

	return (
		<div className="flex flex-col flex-1">
			<div className="px-6 pt-4 pb-2">
				<h2 className="text-lg font-bold text-foreground mb-4">
					Select the correct translation
				</h2>

				<div className="flex items-start gap-3 mb-6">
					<div className="flex-shrink-0 w-20 h-24 rounded-2xl bg-duo-orange/20 flex items-end justify-center overflow-hidden">
						<div className="w-12 h-16 rounded-t-full bg-duo-orange/60" />
					</div>
					<div className="flex items-center gap-2 bg-white border-2 border-border rounded-2xl px-4 py-3 shadow-sm">
						{challenge.audioUrl && (
							<AudioButton audioUrl={challenge.audioUrl} size="sm" />
						)}
						<span className="text-base font-medium">{challenge.question}</span>
					</div>
				</div>
			</div>

			<div className="px-6 flex-1 space-y-3">
				{challenge.options.map((opt) => (
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
				<div className="px-6 py-4 mt-auto">
					<button
						onClick={() => selectedOption && onAnswer(selectedOption.text)}
						disabled={!selectedId}
						className="w-full py-3 rounded-2xl text-white font-bold text-base border-b-4 border-duo-green-dark bg-duo-green transition-all active:scale-[0.98] active:border-b-2 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Check
					</button>
				</div>
			)}
		</div>
	);
}

export function getSelectTranslationCorrectAnswer(challenge: Challenge): string {
	const correct = challenge.options.find((o) => o.isCorrect);
	return correct?.text ?? "";
}
