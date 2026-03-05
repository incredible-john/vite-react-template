import { useState, useMemo } from "react";
import type { Challenge } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MatchPairsChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

interface Pair {
	leftId: number;
	rightId: number;
}

export function MatchPairsChallenge({ challenge, onAnswer, answered }: MatchPairsChallengeProps) {
	const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
	const [selectedRight, setSelectedRight] = useState<number | null>(null);
	const [matchedPairs, setMatchedPairs] = useState<Pair[]>([]);

	const leftItems = useMemo(
		() => challenge.options.filter((_, i) => i % 2 === 0),
		[challenge.options]
	);
	const rightItems = useMemo(
		() => challenge.options.filter((_, i) => i % 2 === 1),
		[challenge.options]
	);

	const shuffledRight = useMemo(() => {
		const arr = [...rightItems];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [challenge.id]);

	const isLeftMatched = (id: number) => matchedPairs.some((p) => p.leftId === id);
	const isRightMatched = (id: number) => matchedPairs.some((p) => p.rightId === id);

	const handleLeftClick = (id: number) => {
		if (answered || isLeftMatched(id)) return;
		setSelectedLeft(id);
		if (selectedRight !== null) {
			tryMatch(id, selectedRight);
		}
	};

	const handleRightClick = (id: number) => {
		if (answered || isRightMatched(id)) return;
		setSelectedRight(id);
		if (selectedLeft !== null) {
			tryMatch(selectedLeft, id);
		}
	};

	const tryMatch = (leftId: number, rightId: number) => {
		const newPairs = [...matchedPairs, { leftId, rightId }];
		setMatchedPairs(newPairs);
		setSelectedLeft(null);
		setSelectedRight(null);

		if (newPairs.length === leftItems.length) {
			const answer = newPairs.map((p) => `${p.leftId}-${p.rightId}`).join(",");
			onAnswer(answer);
		}
	};

	return (
		<div className="flex flex-col flex-1">
			<div className="px-6 pt-4 pb-2">
				<h2 className="text-lg font-bold text-foreground mb-4">Match the pairs</h2>
			</div>

			<div className="px-6 flex-1">
				<div className="grid grid-cols-2 gap-3">
					{/* Left column */}
					<div className="space-y-3">
						{leftItems.map((item) => (
							<button
								key={item.id}
								onClick={() => handleLeftClick(item.id)}
								disabled={answered || isLeftMatched(item.id)}
								className={cn(
									"w-full py-4 px-4 rounded-2xl border-2 font-medium transition-all text-center",
									"border-b-4 active:border-b-2",
									isLeftMatched(item.id)
										? "bg-duo-green-light border-duo-green text-duo-green-dark opacity-70"
										: selectedLeft === item.id
											? "bg-duo-blue/10 border-duo-blue text-duo-blue"
											: "bg-white border-border text-foreground hover:border-duo-gray-dark"
								)}
							>
								{item.text}
							</button>
						))}
					</div>

					{/* Right column */}
					<div className="space-y-3">
						{shuffledRight.map((item) => (
							<button
								key={item.id}
								onClick={() => handleRightClick(item.id)}
								disabled={answered || isRightMatched(item.id)}
								className={cn(
									"w-full py-4 px-4 rounded-2xl border-2 font-medium transition-all text-center",
									"border-b-4 active:border-b-2",
									isRightMatched(item.id)
										? "bg-duo-green-light border-duo-green text-duo-green-dark opacity-70"
										: selectedRight === item.id
											? "bg-duo-blue/10 border-duo-blue text-duo-blue"
											: "bg-white border-border text-foreground hover:border-duo-gray-dark"
								)}
							>
								{item.text}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export function getMatchPairsCorrectAnswer(challenge: Challenge): string {
	const leftItems = challenge.options.filter((_, i) => i % 2 === 0);
	const rightItems = challenge.options.filter((_, i) => i % 2 === 1);
	return leftItems.map((l, i) => `${l.id}-${rightItems[i].id}`).join(",");
}
