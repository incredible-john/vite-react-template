import { useCallback, useEffect, useMemo, useState } from "react";
import { Turtle } from "lucide-react";
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

function getQuestionTokens(question: string): string[] {
	return extractWords(question);
}

export function DictationAssemblyChallenge({
	challenge,
	onAnswer,
	answered,
}: DictationAssemblyChallengeProps) {
	const [selected, setSelected] = useState<number[]>([]);

	const orderedTokens = useMemo(() => getQuestionTokens(challenge.question), [challenge.question]);
	const tokenByOrder = useMemo(
		() => new Map(orderedTokens.map((token, index) => [index, token])),
		[orderedTokens]
	);
	const shuffledTokens = useMemo(
		() => shuffleArray(orderedTokens.map((text, order) => ({ id: `${challenge.id}-${order}-${text}`, text, order }))),
		[challenge.id, orderedTokens]
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
		() => selected.map((order) => tokenByOrder.get(order)!).join(""),
		[selected, tokenByOrder]
	);

	return (
		<div className="flex flex-col flex-1">
			<div className="px-6 pt-4 pb-2">
				<h2 className="text-lg font-bold text-foreground mb-4">Listen and build what you hear</h2>

				<div className="rounded-3xl border-2 border-border bg-white px-5 py-5 shadow-sm mb-6">
					<div className="flex items-center gap-3 mb-3">
						<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-duo-blue/10 text-duo-blue">
							<Turtle size={24} />
						</div>
						<div>
							<p className="text-sm font-semibold text-foreground">No text shown</p>
							<p className="text-sm text-muted-foreground">Use the audio and assemble the sentence.</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-muted/40 px-4 py-4">
							<AudioButton text={challenge.question} size="md" />
							<div className="text-center">
								<p className="text-sm font-semibold text-foreground">Normal</p>
								<p className="text-xs text-muted-foreground">Standard speed</p>
							</div>
						</div>

						<div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-border bg-muted/40 px-4 py-4">
							<AudioButton text={challenge.question} size="md" variant="slow" />
							<div className="text-center">
								<p className="text-sm font-semibold text-foreground">Slow</p>
								<p className="text-xs text-muted-foreground">Slower playback</p>
							</div>
						</div>
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
