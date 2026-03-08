import { useState } from "react";
import type { Challenge } from "@/lib/types";
import { AudioButton } from "./AudioButton";
import { cn } from "@/lib/utils";

interface FillBlankChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

export function FillBlankChallenge({ challenge, onAnswer, answered }: FillBlankChallengeProps) {
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const parts = challenge.question.split("___");
	const selectedOption = challenge.options.find((o) => o.id === selectedId);

	return (
		<div className="flex flex-col flex-1">
			<div className="px-6 pt-4 pb-2">
				<h2 className="text-lg font-bold text-foreground mb-4">Fill in the blank</h2>

				{/* Character + speech bubble */}
				<div className="flex items-start gap-3 mb-6">
					<div className="flex-shrink-0 w-20 h-24 rounded-2xl bg-duo-blue/20 flex items-end justify-center overflow-hidden">
						<div className="w-12 h-16 rounded-t-full bg-duo-blue/60" />
					</div>
					<div className="bg-white border-2 border-border rounded-2xl px-4 py-3 shadow-sm">
						<div className="flex items-center gap-1 flex-wrap">
							{challenge.audioUrl && (
								<AudioButton audioUrl={challenge.audioUrl} size="sm" className="mr-1" />
							)}
							<span className="text-base font-medium">{parts[0]}</span>
							<span className="inline-block min-w-[4rem] border-b-2 border-duo-blue text-center font-bold text-duo-blue px-1">
								{selectedOption?.text ?? ""}
							</span>
							{parts[1] && <span className="text-base font-medium">{parts[1]}</span>}
						</div>
					</div>
				</div>
			</div>

			{/* Options */}
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

			{/* Check button */}
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

export function getFillBlankCorrectAnswer(challenge: Challenge): string {
	const correct = challenge.options.find((o) => o.isCorrect);
	return correct?.text ?? "";
}
