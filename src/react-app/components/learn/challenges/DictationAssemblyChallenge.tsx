import { useCallback, useEffect, useMemo, useState } from "react";
import type { Challenge } from "@/lib/types";
import { AudioButton } from "../AudioButton";
import { WordTile } from "../WordTile";
import { CheckButton } from "./CheckButton";
import { playTts, stopTts } from "@/lib/sounds";
import { buildTtsUrl } from "@/lib/preloadCache";
import { extractWords } from "@/lib/textSegmentation";

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

interface DictationAssemblyChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

export function DictationAssemblyChallenge({
	challenge,
	onAnswer,
	answered,
}: DictationAssemblyChallengeProps) {
	const [selected, setSelected] = useState<number[]>([]);

	const orderedQuestionTokens = useMemo(
		() => extractWords(challenge.question),
		[challenge.question]
	);

	// Combine question tokens (correct words) with option distractors into one word bank.
	// Question tokens get orders 0..N-1; option distractors get orders N..N+M-1.
	const allWordBankItems = useMemo(() => {
		const questionItems = orderedQuestionTokens.map((text, order) => ({
			id: `${challenge.id}-q-${order}-${text}`,
			text,
			order,
		}));

		if (challenge.options.length === 0) return questionItems;

		const baseOrder = orderedQuestionTokens.length;
		const optionItems = challenge.options.map((opt, i) => ({
			id: `${challenge.id}-o-${i}-${opt.text}`,
			text: opt.text,
			order: baseOrder + i,
		}));

		return [...questionItems, ...optionItems];
	}, [challenge.id, challenge.options, orderedQuestionTokens]);

	const tokenByOrder = useMemo(
		() => new Map(allWordBankItems.map((item) => [item.order, item.text])),
		[allWordBankItems]
	);
	const shuffledTokens = useMemo(
		() => shuffleArray(allWordBankItems),
		[allWordBankItems]
	);

	useEffect(() => {
		playTts(buildTtsUrl(challenge.question));
		return () => stopTts();
	}, [challenge.question]);

	const handleSelectFromBank = useCallback(
		(order: number, text: string) => {
			if (answered) return;
			playTts(buildTtsUrl(text));
			setSelected((prev) => [...prev, order]);
		},
		[answered]
	);

	const handleRemoveFromAnswer = useCallback(
		(position: number) => {
			if (answered) return;
			setSelected((prev) => prev.filter((_, index) => index !== position));
		},
		[answered]
	);

	const currentAnswer = useMemo(
		() => selected.map((order) => tokenByOrder.get(order)!).join(" "),
		[selected, tokenByOrder]
	);

	return (
		<div className="flex flex-col flex-1">
			<div className="px-6 pt-4 pb-2">
				<h2 className="text-lg font-bold text-foreground mb-4">Listen and build what you hear</h2>

				<div className="flex justify-center gap-4 mb-6">
					<div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-duo-blue/30 bg-duo-blue/5 px-6 py-4 shadow-sm">
						<AudioButton text={challenge.question} size="md" />
					</div>
					<div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-duo-blue/30 bg-duo-blue/5 px-6 py-4 shadow-sm">
						<AudioButton text={challenge.question} size="md" variant="slow" icon="turtle" />
					</div>
				</div>
			</div>

			<div className="px-6 mb-4">
				<div className="min-h-[52px] flex flex-wrap gap-2 border-b-2 border-border pb-3 mb-1">
					{selected.map((order, position) => {
						const token = tokenByOrder.get(order);
						if (!token) return null;
						return (
							<WordTile
								key={`answer-${position}-${order}`}
								text={token}
								variant="answer"
								onClick={() => handleRemoveFromAnswer(position)}
								disabled={answered}
							/>
						);
					})}
				</div>
			</div>

			<div className="px-6 flex-1">
				<div className="flex flex-wrap gap-2 justify-center">
					{shuffledTokens.map((token) => (
						<WordTile
							key={token.id}
							text={token.text}
							selected={selected.includes(token.order)}
							onClick={() => handleSelectFromBank(token.order, token.text)}
							disabled={answered}
						/>
					))}
				</div>
			</div>

			{!answered && (
				<CheckButton onClick={() => onAnswer(currentAnswer)} disabled={selected.length === 0} />
			)}
		</div>
	);
}
