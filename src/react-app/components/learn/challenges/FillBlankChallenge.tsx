import { useState, useEffect } from "react";
import type { Challenge } from "@/lib/types";
import { AudioButton } from "../AudioButton";
import { InteractiveWord } from "../InteractiveWord";
import { cn } from "@/lib/utils";
import { CheckButton } from "./CheckButton";
import { playTts, stopTts } from "@/lib/sounds";

interface FillBlankChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

// Helper function to split text into words while preserving spaces and punctuation
function parseWords(text: string): Array<{ type: "word" | "space"; value: string }> {
	const parts = text.split(/(\s+)/);
	return parts
		.filter((p) => p.length > 0)
		.map((part) =>
			/^\s+$/.test(part) ? { type: "space" as const, value: part } : { type: "word" as const, value: part }
		);
}

export function FillBlankChallenge({ challenge, onAnswer, answered }: FillBlankChallengeProps) {
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const parts = challenge.question.split("___");
	const selectedOption = challenge.options.find((o) => o.id === selectedId);

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
				<h2 className="text-lg font-bold text-foreground mb-4">Fill in the blank</h2>

				{/* Character + speech bubble */}
				<div className="flex items-start gap-3 mb-6">
					<div className="flex-shrink-0 w-20 h-24 rounded-2xl bg-duo-blue/20 flex items-end justify-center overflow-hidden">
						<div className="w-12 h-16 rounded-t-full bg-duo-blue/60" />
					</div>
					<div className="bg-white border-2 border-border rounded-2xl px-4 py-3 shadow-sm">
						<div className="flex items-center gap-1 flex-wrap">
							<AudioButton text={challenge.question} size="sm" className="mr-1" />
							{parts[0] && renderInteractiveText(parts[0])}
							<span className="inline-block min-w-[4rem] border-b-2 border-duo-blue text-center font-bold text-duo-blue px-1">
								{selectedOption?.text ?? ""}
							</span>
							{parts[1] && renderInteractiveText(parts[1])}
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
				<CheckButton
					onClick={() => selectedOption && onAnswer(selectedOption.text)}
					disabled={!selectedId}
				/>
			)}
		</div>
	);
}

export function getFillBlankCorrectAnswer(challenge: Challenge): string {
	const correct = challenge.options.find((o) => o.isCorrect);
	return correct?.text ?? "";
}
