import { useState, useCallback, useEffect, useMemo } from "react";
import type { Challenge } from "@/lib/types";
import { AudioButton } from "../AudioButton";
import { InteractiveWord } from "../InteractiveWord";
import { WordTile } from "../WordTile";
import { CheckButton } from "./CheckButton";
import { playTts, stopTts } from "@/lib/sounds";

interface TranslationAssemblyChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

// Helper function to split text into words
function parseWords(text: string): Array<{ type: "word" | "space"; value: string }> {
	const result: Array<{ type: "word" | "space"; value: string }> = [];
	const wordRegex = /(\s+)/g;
	let lastIndex = 0;
	let match;

	while ((match = wordRegex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			const word = text.slice(lastIndex, match.index).trim();
			if (word) {
				result.push({ type: "word", value: word });
			}
		}
		if (match[1]) {
			result.push({ type: "space", value: match[1] });
		}
		lastIndex = wordRegex.lastIndex;
	}

	if (lastIndex < text.length) {
		const word = text.slice(lastIndex).trim();
		if (word) {
			result.push({ type: "word", value: word });
		}
	}

	return result;
}

export function TranslationAssemblyChallenge({ challenge, onAnswer, answered }: TranslationAssemblyChallengeProps) {
	const [selected, setSelected] = useState<number[]>([]);

	const options = challenge.options;

	// Shuffle options for display
	const shuffledOptions = useMemo(() => {
		const arr = [...challenge.options];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [challenge.id]);

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
						<AudioButton text={challenge.question} size="sm" />
						<span className="text-base font-medium">{renderInteractiveText(challenge.question)}</span>
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
					{shuffledOptions.map((opt) => (
						<WordTile
							key={opt.id}
							text={opt.text}
							selected={selected.includes(opt.order)}
							onClick={() => handleSelectFromBank(opt.order)}
							disabled={answered}
						/>
					))}
				</div>
			</div>

			{/* Check button */}
			{!answered && (
				<CheckButton onClick={handleCheck} disabled={selected.length === 0} />
			)}
		</div>
	);
}

export function getTranslationAssemblyCorrectAnswer(challenge: Challenge): string {
	return challenge.options
		.filter((o) => o.isCorrect)
		.sort((a, b) => a.order - b.order)
		.map((o) => o.text)
		.join("");
}
