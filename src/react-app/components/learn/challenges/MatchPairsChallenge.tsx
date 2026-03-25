import { useState, useMemo } from "react";
import type { Challenge, ChallengeOption } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckButton } from "./CheckButton";
import { playIncorrectSound, playTts } from "@/lib/sounds";

interface MatchPairsChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

interface Pair {
	leftId: number;
	rightId: number;
}

// Check if text contains Chinese characters
const isChinese = (text: string): boolean => /[\u4e00-\u9fa5]/.test(text);

export function MatchPairsChallenge({ challenge, onAnswer, answered }: MatchPairsChallengeProps) {
	const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
	const [selectedRight, setSelectedRight] = useState<number | null>(null);
	const [matchedPairs, setMatchedPairs] = useState<Pair[]>([]);
	const [errorPair, setErrorPair] = useState<{ leftId: number; rightId: number } | null>(null);

	// Separate Chinese (left) and English (right) options
	const { chineseItems, englishItems } = useMemo(() => {
		const chinese: ChallengeOption[] = [];
		const english: ChallengeOption[] = [];
		challenge.options.forEach((opt) => {
			if (isChinese(opt.text)) {
				chinese.push(opt);
			} else {
				english.push(opt);
			}
		});
		return { chineseItems: chinese, englishItems: english };
	}, [challenge.options]);

	// Shuffle English items for display
	const shuffledEnglish = useMemo(() => {
		const arr = [...englishItems];
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
		// Toggle off if already selected
		if (selectedLeft === id) {
			setSelectedLeft(null);
			return;
		}
		setSelectedLeft(id);
		if (selectedRight !== null) {
			tryMatch(id, selectedRight);
		}
	};

	const handleRightClick = (id: number, item: ChallengeOption) => {
		if (answered || isRightMatched(id)) return;

		// Play audio for English word
		playTts(`/api/audio/tts?text=${encodeURIComponent(item.text)}`);

		// Toggle off if already selected
		if (selectedRight === id) {
			setSelectedRight(null);
			return;
		}
		setSelectedRight(id);
		if (selectedLeft !== null) {
			tryMatch(selectedLeft, id);
		}
	};

	const tryMatch = (leftId: number, rightId: number) => {
		// Check if this is a correct match
		const leftIndex = chineseItems.findIndex((l) => l.id === leftId);
		const correctRightId = englishItems[leftIndex]?.id;
		const isCorrect = correctRightId === rightId;

		if (!isCorrect) {
			// Show error state and play sound
			setErrorPair({ leftId, rightId });
			playIncorrectSound();

			// Reset after delay
			setTimeout(() => {
				setErrorPair(null);
				setSelectedLeft(null);
				setSelectedRight(null);
			}, 500);
			return;
		}

		const newPairs = [...matchedPairs, { leftId, rightId }];
		setMatchedPairs(newPairs);
		setSelectedLeft(null);
		setSelectedRight(null);

		if (newPairs.length === chineseItems.length) {
			const sortedPairs = [...newPairs].sort((a, b) => a.leftId - b.leftId);
			const answer = sortedPairs.map((p) => `${p.leftId}-${p.rightId}`).join(",");
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
					{/* Left column - Chinese */}
					<div className="space-y-3">
						{chineseItems.map((item) => (
							<button
								key={item.id}
								onClick={() => handleLeftClick(item.id)}
								disabled={answered || isLeftMatched(item.id)}
								className={cn(
									"w-full py-4 px-4 rounded-2xl border-2 font-medium transition-all text-center",
									"border-b-4 active:border-b-2",
									isLeftMatched(item.id)
										? "bg-duo-green-light border-duo-green text-duo-green-dark opacity-70"
										: errorPair?.leftId === item.id
											? "bg-red-100 border-red-500 text-red-700"
											: selectedLeft === item.id
												? "bg-duo-blue/10 border-duo-blue text-duo-blue"
												: "bg-white border-border text-foreground hover:border-duo-gray-dark"
								)}
							>
								{item.text}
							</button>
						))}
					</div>

					{/* Right column - English (shuffled) */}
					<div className="space-y-3">
						{shuffledEnglish.map((item) => (
							<button
								key={item.id}
								onClick={() => handleRightClick(item.id, item)}
								disabled={answered || isRightMatched(item.id)}
								className={cn(
									"w-full py-4 px-4 rounded-2xl border-2 font-medium transition-all text-center",
									"border-b-4 active:border-b-2",
									isRightMatched(item.id)
										? "bg-duo-green-light border-duo-green text-duo-green-dark opacity-70"
										: errorPair?.rightId === item.id
											? "bg-red-100 border-red-500 text-red-700"
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

			{/* Check button */}
			{!answered && (
				<CheckButton onClick={() => {}} disabled={true} />
			)}
		</div>
	);
}

