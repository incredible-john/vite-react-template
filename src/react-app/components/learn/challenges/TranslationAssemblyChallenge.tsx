import { useState, useCallback, useEffect, useMemo } from "react";
import type { Challenge } from "@/lib/types";
import { AudioButton } from "../AudioButton";
import { InteractiveWord } from "../InteractiveWord";
import { WordTile } from "../WordTile";
import { CheckButton } from "./CheckButton";
import { playTts, stopTts } from "@/lib/sounds";
import { buildTtsUrl } from "@/lib/preloadCache";
import {
	getChallengeSourceLang,
	getChallengeTargetLang,
} from "@/lib/challengeLanguages";
import { getTranslationAssemblyWordBank } from "@/lib/translationAssembly";
import { extractWords, segmentText, type ParsedWordPiece } from "@/lib/textSegmentation";

interface TranslationAssemblyChallengeProps {
	challenge: Challenge;
	onAnswer: (answer: string) => void;
	answered: boolean;
}

function findPrevWordPiece(pieces: ParsedWordPiece[], fromIndex: number) {
	for (let i = fromIndex - 1; i >= 0; i--) {
		if (pieces[i].type === "word") return pieces[i];
	}
	return undefined;
}

function findNextWordPiece(pieces: ParsedWordPiece[], fromIndex: number) {
	for (let i = fromIndex + 1; i < pieces.length; i++) {
		if (pieces[i].type === "word") return pieces[i];
	}
	return undefined;
}

function shuffleArray<T>(array: T[]): T[] {
	return [...array].sort(() => Math.random() - 0.5);
}

export function TranslationAssemblyChallenge({ challenge, onAnswer, answered }: TranslationAssemblyChallengeProps) {
	const [selected, setSelected] = useState<number[]>([]);

	const sourceLang = getChallengeSourceLang(challenge);
	const targetLang = getChallengeTargetLang(challenge);
	const options = useMemo(() => getTranslationAssemblyWordBank(challenge), [challenge]);
	const selectedOptions = useMemo(
		() => selected.map((order) => options.find((candidate) => candidate.order === order)!),
		[selected, options]
	);

	// Shuffle options for display
	const shuffledOptions = useMemo(() => shuffleArray(options), [options]);

	// Auto-play question audio on mount
	useEffect(() => {
		if (sourceLang === "zh") {
			return () => stopTts();
		}

		playTts(buildTtsUrl(challenge.question));
		return () => stopTts();
	}, [challenge.question, sourceLang]);

	const questionPieces = useMemo(
		() => segmentText(challenge.question, sourceLang),
		[challenge.question, sourceLang]
	);
	const tokenWordSets = useMemo(
		() =>
			challenge.tokens.map((token) => ({
				token,
				words: extractWords(token.text, sourceLang),
			})),
		[challenge.tokens, sourceLang]
	);

	const renderParsedQuestion = questionPieces.map((item, idx) => {
		if (item.type === "space") {
			return <span key={idx}>{item.value}</span>;
		}
		const token = tokenWordSets
			.filter(({ words: tokenWords }) => {
				const prevWordPiece = findPrevWordPiece(questionPieces, idx);
				const nextWordPiece = findNextWordPiece(questionPieces, idx);

				const itemInToken = tokenWords.includes(item.value);

				// If token contains only one word, just match current word
				if (tokenWords.length === 1) {
					return itemInToken;
				}

				// If token has multiple words, check context: adjacent *word* segments only (skip spaces/punctuation)
				let neighborWordInToken = false;
				if (prevWordPiece && tokenWords.includes(prevWordPiece.value)) {
					neighborWordInToken = true;
				}
				if (nextWordPiece && tokenWords.includes(nextWordPiece.value)) {
					neighborWordInToken = true;
				}

				return itemInToken && neighborWordInToken;
			})
			.map(({ token }) => token);
		return (
			<InteractiveWord
				key={idx}
				word={item.value}
				className="text-base font-medium"
				prefetchedTranslation={token}
				sourceLang={sourceLang}
				targetLang={targetLang}
				playAudioOnClick={sourceLang !== "zh"}
			/>
		);
	});

	const handleSelectFromBank = useCallback(
		(order: number, text: string) => {
			if (answered) return;
			if (targetLang === "en") {
				playTts(buildTtsUrl(text));
			}
			setSelected((prev) => [...prev, order]);
		},
		[answered, targetLang]
	);

	const handleRemoveFromAnswer = useCallback(
		(posInAnswer: number) => {
			if (answered) return;
			setSelected((prev) => prev.filter((_, i) => i !== posInAnswer));
		},
		[answered]
	);

	const handleCheck = () => {
		onAnswer(selectedOptions.map((option) => option.text).join(""));
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
						<span className="text-base font-medium">{renderParsedQuestion}</span>
					</div>
				</div>
			</div>

			{/* Answer area */}
			<div className="px-6 mb-4">
				<div className="min-h-[52px] flex flex-wrap gap-2 border-b-2 border-border pb-3 mb-1">
					{selectedOptions.map((option, posInAnswer) => {
						return (
							<WordTile
								key={`answer-${posInAnswer}`}
								text={option.text}
								variant="answer"
								onClick={() => handleRemoveFromAnswer(posInAnswer)}
								disabled={answered}
							/>
						);
					})}
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
							onClick={() => handleSelectFromBank(opt.order, opt.text)}
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

