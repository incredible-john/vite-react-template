import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChallengeHeader } from "@/components/learn/challenges/ChallengeHeader";
import { DictationAssemblyChallenge } from "@/components/learn/challenges/DictationAssemblyChallenge";
import { FeedbackBanner } from "@/components/learn/challenges/FeedbackBanner";
import { FillBlankChallenge } from "@/components/learn/challenges/FillBlankChallenge";
import { MatchPairsChallenge } from "@/components/learn/challenges/MatchPairsChallenge";
import { SelectTranslationChallenge } from "@/components/learn/challenges/SelectTranslationChallenge";
import { TranslationAssemblyChallenge } from "@/components/learn/challenges/TranslationAssemblyChallenge";
import { VerbConjugationChallenge } from "@/components/learn/challenges/VerbConjugationChallenge";
import { LessonComplete } from "@/components/learn/LessonComplete";
import { MobileShell } from "@/components/layout/MobileShell";
import { getLesson, markChallengeComplete } from "@/lib/api";
import { getChallengeCorrectAnswer } from "@/lib/challengeCorrectAnswers";
import { preloadChallenges, stopPreload } from "@/lib/preloadCache";
import { playCorrectSound, playIncorrectSound } from "@/lib/sounds";
import type { Challenge, LessonWithChallenges } from "@/lib/types";

const MAX_HEARTS = 5;

type QueueItem = {
	challenge: Challenge;
	done: boolean;
	key: number;
};

interface LearnPageProps {
	mockLesson?: LessonWithChallenges;
}

function checkAnswer(challenge: Challenge, answer: string): boolean {
	return answer === getChallengeCorrectAnswer(challenge);
}

let keyCounter = 0;

export function LearnPage({ mockLesson }: LearnPageProps) {
	const { id } = useParams();
	const navigate = useNavigate();
	const [lesson, setLesson] = useState<LessonWithChallenges | null>(null);
	const [loading, setLoading] = useState(true);
	const [queue, setQueue] = useState<QueueItem[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const hearts = MAX_HEARTS;
	const [answered, setAnswered] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		setCurrentIndex(0);
		setAnswered(false);
		setIsCorrect(false);
		setIsComplete(false);
		setLesson(null);
		setQueue([]);

		if (mockLesson) {
			setLesson(mockLesson);
			setQueue(mockLesson.challenges.map((challenge) => ({ challenge, done: false, key: keyCounter++ })));
			preloadChallenges(mockLesson.challenges);
			setLoading(false);
			return () => stopPreload();
		}

		if (!id) {
			setLoading(false);
			return;
		}

		setLoading(true);
		getLesson(Number(id))
			.then((data) => {
				setLesson(data);
				const challenges = data?.challenges ?? [];
				setQueue(challenges.map((challenge) => ({ challenge, done: false, key: keyCounter++ })));
				preloadChallenges(challenges);
			})
			.finally(() => setLoading(false));

		return () => stopPreload();
	}, [id, mockLesson]);

	useEffect(() => {
		if (!loading && queue.length > 0 && currentIndex >= queue.length) {
			setIsComplete(true);
		}
	}, [currentIndex, loading, queue.length]);

	const currentItem = queue[currentIndex];
	const current = currentItem?.challenge;
	const completedCount = queue.filter((item) => item.done).length;
	const progress = queue.length > 0 ? completedCount / queue.length : 0;

	const handleAnswer = useCallback(
		(answer: string) => {
			if (!current || !currentItem) return;

			const correct = checkAnswer(current, answer);
			setIsCorrect(correct);
			setAnswered(true);

			if (correct) {
				playCorrectSound();
				if (!mockLesson && current.id > 0) {
					void markChallengeComplete(current.id).catch(() => {});
				}
				setQueue((prev) =>
					prev.map((item) =>
						item.key === currentItem.key ? { ...item, done: true } : item
					)
				);
				return;
			}

			playIncorrectSound();
			setQueue((prev) => {
				const updated = prev.map((item) =>
					item.key === currentItem.key ? { ...item, done: true } : item
				);
				return [...updated, { challenge: currentItem.challenge, done: false, key: keyCounter++ }];
			});
		},
		[current, currentItem, mockLesson]
	);

	const handleContinue = useCallback(() => {
		setCurrentIndex((index) => index + 1);
		setAnswered(false);
		setIsCorrect(false);
	}, []);

	if (loading) {
		return (
			<MobileShell>
				<div className="flex flex-1 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-duo-green border-t-transparent" />
				</div>
			</MobileShell>
		);
	}

	if (!lesson || queue.length === 0) {
		return (
			<MobileShell>
				<div className="flex flex-1 flex-col items-center justify-center p-8 text-muted-foreground">
					<p className="mb-4 text-lg">No challenges found for this lesson.</p>
					<button
						onClick={() => navigate(-1)}
						className="rounded-xl bg-duo-green px-6 py-2 font-bold text-white"
					>
						Go back
					</button>
				</div>
			</MobileShell>
		);
	}

	if (isComplete) {
		return (
			<MobileShell>
				<LessonComplete hearts={hearts} maxHearts={MAX_HEARTS} />
			</MobileShell>
		);
	}

	return (
		<MobileShell>
			<ChallengeHeader progress={progress} hearts={hearts} maxHearts={MAX_HEARTS} />

			{current && currentItem && (
				<div className="flex flex-1 flex-col" key={currentItem.key}>
					{current.type === "TRANSLATE" && (
						<TranslationAssemblyChallenge challenge={current} onAnswer={handleAnswer} answered={answered} />
					)}
					{current.type === "FILL_BLANK" && (
						<FillBlankChallenge challenge={current} onAnswer={handleAnswer} answered={answered} />
					)}
					{current.type === "MATCH_PAIRS" && (
						<MatchPairsChallenge challenge={current} onAnswer={handleAnswer} answered={answered} />
					)}
					{current.type === "SELECT_TRANSLATION" && (
						<SelectTranslationChallenge challenge={current} onAnswer={handleAnswer} answered={answered} />
					)}
					{current.type === "VERB_CONJUGATION" && (
						<VerbConjugationChallenge challenge={current} onAnswer={handleAnswer} answered={answered} />
					)}
					{current.type === "DICTATION_ASSEMBLY" && (
						<DictationAssemblyChallenge challenge={current} onAnswer={handleAnswer} answered={answered} />
					)}
				</div>
			)}

			{answered && (
				<FeedbackBanner
					isCorrect={isCorrect}
					correctAnswer={current ? getChallengeCorrectAnswer(current) : undefined}
					translation={isCorrect ? current?.translation : undefined}
					onContinue={handleContinue}
				/>
			)}
		</MobileShell>
	);
}
