import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { getLesson } from "@/lib/api";
import type { Challenge, LessonWithChallenges } from "@/lib/types";
import { ChallengeHeader } from "@/components/learn/challenges/ChallengeHeader";
import { FeedbackBanner } from "@/components/learn/challenges/FeedbackBanner";
import { TranslationAssemblyChallenge, getTranslationAssemblyCorrectAnswer } from "@/components/learn/challenges/TranslationAssemblyChallenge";
import { FillBlankChallenge, getFillBlankCorrectAnswer } from "@/components/learn/challenges/FillBlankChallenge";
import { MatchPairsChallenge, getMatchPairsCorrectAnswer } from "@/components/learn/challenges/MatchPairsChallenge";
import { SelectTranslationChallenge, getSelectTranslationCorrectAnswer } from "@/components/learn/challenges/SelectTranslationChallenge";
import { LessonComplete } from "@/components/learn/LessonComplete";
import { MobileShell } from "@/components/layout/MobileShell";
import { playCorrectSound, playIncorrectSound } from "@/lib/sounds";

const MAX_HEARTS = 999;

type QueueItem = {
	challenge: Challenge;
	done: boolean;
	/** unique key per attempt, used to force re-mount on retry */
	key: number;
};

function getCorrectAnswer(challenge: Challenge): string {
	switch (challenge.type) {
		case "TRANSLATE":
			return getTranslationAssemblyCorrectAnswer(challenge);
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

let keyCounter = 0;

export function LearnPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [lesson, setLesson] = useState<LessonWithChallenges | null>(null);
	const [loading, setLoading] = useState(true);
	const [queue, setQueue] = useState<QueueItem[]>([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [hearts, setHearts] = useState(MAX_HEARTS);
	const [answered, setAnswered] = useState(false);
	const [isCorrect, setIsCorrect] = useState(false);
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		if (!id) return;
		getLesson(Number(id))
			.then((data) => {
				setLesson(data);
				const challenges = data?.challenges ?? [];
				setQueue(challenges.map((c) => ({ challenge: c, done: false, key: keyCounter++ })));
			})
			.finally(() => setLoading(false));
	}, [id]);

	useEffect(() => {
		if (!loading && queue.length > 0 && currentIndex >= queue.length) {
			// 所有题目都完成了，显示完成界面
			setIsComplete(true);
		}
	}, [queue.length, currentIndex, loading]);

	const currentItem = queue[currentIndex] as QueueItem | undefined;
	const current = currentItem?.challenge;

	// 进度 = 已完成数 / 总数，在 handleAnswer 时就已更新，点击 Continue 不会引起变化
	const completedCount = queue.filter((item) => item.done).length;
	const progress = queue.length > 0 ? completedCount / queue.length : 0;

	const handleAnswer = useCallback(
		(answer: string) => {
			if (!currentItem || !current) return;
			const correct = checkAnswer(current, answer);
			setIsCorrect(correct);
			setAnswered(true);
			if (correct) {
				playCorrectSound();
				// 答对：标记为完成，进度推进
				setQueue((prev) =>
					prev.map((item) =>
						item.key === currentItem.key ? { ...item, done: true } : item
					)
				);
			} else {
				playIncorrectSound();
				setHearts((h) => Math.max(0, h - 1));
				// 答错：标记为完成并追加副本到队尾，进度以新总数为分母推进
				setQueue((prev) => {
					const updated = prev.map((item) =>
						item.key === currentItem.key ? { ...item, done: true } : item
					);
					return [...updated, { challenge: currentItem.challenge, done: false, key: keyCounter++ }];
				});
			}
		},
		[current, currentItem]
	);

	const handleContinue = useCallback(() => {
		setCurrentIndex((i) => i + 1);
		setAnswered(false);
		setIsCorrect(false);
	}, []);

	if (loading) {
		return (
			<MobileShell>
				<div className="flex-1 flex items-center justify-center">
					<div className="h-8 w-8 rounded-full border-4 border-duo-green border-t-transparent animate-spin" />
				</div>
			</MobileShell>
		);
	}

	if (!lesson || queue.length === 0) {
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

	if (isComplete) {
		return (
			<MobileShell>
				<LessonComplete hearts={hearts} maxHearts={MAX_HEARTS} />
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

			{current && currentItem && (
				<div className="flex-1 flex flex-col" key={currentItem.key}>
					{current.type === "TRANSLATE" && (
						<TranslationAssemblyChallenge
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
