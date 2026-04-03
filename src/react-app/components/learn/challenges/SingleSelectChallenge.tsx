import { useEffect, useMemo, useState } from "react";
import type { Challenge } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckButton } from "./CheckButton";

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

interface SingleSelectChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

export function SingleSelectChallenge({
	challenge,
	onAnswer,
	answered,
}: SingleSelectChallengeProps) {
	const [selectedId, setSelectedId] = useState<number | null>(null);

	const shuffledOptions = useMemo(
		() => shuffleArray(challenge.options),
		[challenge.options]
	);

	const selectedOption = shuffledOptions.find((option) => option.id === selectedId);

	useEffect(() => {
		setSelectedId(null);
	}, [challenge.id]);

	return (
		<div className="flex flex-col flex-1">
			<div className="px-6 pt-4 pb-2">
				<h2 className="mb-4 text-lg font-bold text-foreground">
					Select the correct answer
				</h2>

				<div className="rounded-3xl border-2 border-border bg-white px-5 py-5 shadow-sm">
					<div className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
						Question
					</div>
					<p className="text-lg font-semibold leading-7 text-foreground">
						{challenge.question}
					</p>
				</div>
			</div>

			<div className="flex-1 space-y-3 px-6">
				{shuffledOptions.map((option) => (
					<button
						key={option.id}
						type="button"
						onClick={() => !answered && setSelectedId(option.id)}
						disabled={answered}
						className={cn(
							"w-full rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition-all",
							selectedId === option.id
								? "border-duo-blue bg-duo-blue/5 text-duo-blue"
								: "border-border bg-white text-foreground hover:border-duo-gray-dark"
						)}
					>
						{option.text}
					</button>
				))}
			</div>

			{!answered && (
				<CheckButton
					onClick={() => selectedOption && onAnswer(selectedOption.text)}
					disabled={!selectedOption}
				/>
			)}
		</div>
	);
}
