import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { getLesson } from "@/lib/api";
import type { Challenge, LessonWithChallenges } from "@/lib/types";
import { ChallengeHeader } from "@/components/learn/ChallengeHeader";
import { FeedbackBanner } from "@/components/learn/FeedbackBanner";
import { TranslateChallenge, getTranslateCorrectAnswer } from "@/components/learn/TranslateChallenge";
import { FillBlankChallenge, getFillBlankCorrectAnswer } from "@/components/learn/FillBlankChallenge";
import { MatchPairsChallenge, getMatchPairsCorrectAnswer } from "@/components/learn/MatchPairsChallenge";
import { SelectTranslationChallenge, getSelectTranslationCorrectAnswer } from "@/components/learn/SelectTranslationChallenge";
import { MobileShell } from "@/components/layout/MobileShell";

const MAX_HEARTS = 5;

function getCorrectAnswer(challenge: Challenge): string {
	switch (challenge.type) {
		case "TRANSLATE":
			return getTranslateCorrectAnswer(challenge);
		case "FILL_BLANK":
			return getFillBlankCorrectAnswer(challenge);
		case "MATCH_PAIRS":
			return getMatchPairsCorrectAnswer(challenge);
		case "SELECT_TRANSLATION":
			return getSelectTranslationCorrectAnswer(challenge);
	}
}

function checkAnswer(challenge: Challenge, answer: string): boolean {
	const correct = getCorrectAnswer(challenge);
	return answer === correct;
}

export function LearnPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [lesson, setLesson] = useState<LessonWithChallenges | null>(null);
	const [loading, setLoading] = useState(true);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hearts, setHearts] = useState(MAX_HEARTS);
	const [answered, setAnswered] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);

	useEffect(() => {
		if (!id) return;
		getLesson(Number(id))
			.then(setLesson)
			.finally(() => setLoading(false));
	}, [id]);

	const challenges = lesson?.challenges ?? [];
	const current = challenges[currentIndex] as Challenge | undefined;
	const progress = challenges.length > 0 ? currentIndex / challenges.length : 0;

	const handleAnswer = useCallback(
		(answer: string) => {
			if (!current) return;
			const correct = checkAnswer(current, answer);
			setIsCorrect(correct);
			setAnswered(true);
			if (!correct) {
				setHearts((h) => Math.max(0, h - 1));
			}
		},
		[current]
	);

	const handleContinue = useCallback(() => {
		if (currentIndex + 1 >= challenges.length) {
			navigate(-1);
			return;
		}
		setCurrentIndex((i) => i + 1);
		setAnswered(false);
		setIsCorrect(false);
	}, [currentIndex, challenges.length, navigate]);

	if (loading) {
		return (
			<MobileShell>
				<div className="flex-1 flex items-center justify-center">
					<div className="h-8 w-8 rounded-full border-4 border-duo-green border-t-transparent animate-spin" />
				</div>
			</MobileShell>
		);
	}

	if (!lesson || challenges.length === 0) {
		return (
			<MobileShell>
				<div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
					<p className="text-lg mb-4">No challenges found for this lesson.</p>
					<button
						onClick={() => navigate(-1)}
						className="px-6 py-2 rounded-xl bg-duo-green text-white font-bold"
					>
						Go back
					</button>
				</div>
			</MobileShell>
		);
	}

	if (hearts <= 0) {
		return (
			<MobileShell>
				<div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
					<div className="text-6xl mb-4">💔</div>
					<h2 className="text-2xl font-bold mb-2">Out of hearts!</h2>
					<p className="text-muted-foreground mb-6">Better luck next time.</p>
					<button
						onClick={() => navigate(-1)}
						className="px-8 py-3 rounded-2xl bg-duo-green text-white font-bold border-b-4 border-duo-green-dark"
					>
						Go back
					</button>
				</div>
			</MobileShell>
		);
	}

	return (
		<MobileShell>
			<ChallengeHeader
				progress={progress}
				hearts={hearts}
				maxHearts={MAX_HEARTS}
			/>

			{current && (
				<div className="flex-1 flex flex-col" key={current.id}>
					{current.type === "TRANSLATE" && (
						<TranslateChallenge
							challenge={current}
							onAnswer={handleAnswer}
							answered={answered}
						/>
					)}
					{current.type === "FILL_BLANK" && (
						<FillBlankChallenge
							challenge={current}
							onAnswer={handleAnswer}
							answered={answered}
						/>
					)}
					{current.type === "MATCH_PAIRS" && (
						<MatchPairsChallenge
							challenge={current}
							onAnswer={handleAnswer}
							answered={answered}
						/>
					)}
					{current.type === "SELECT_TRANSLATION" && (
						<SelectTranslationChallenge
							challenge={current}
							onAnswer={handleAnswer}
							answered={answered}
						/>
					)}
				</div>
			)}

			{answered && (
				<FeedbackBanner
					isCorrect={isCorrect}
					correctAnswer={current ? getCorrectAnswer(current) : undefined}
					onContinue={handleContinue}
				/>
			)}
		</MobileShell>
	);
}
