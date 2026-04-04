import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackBannerProps {
	isCorrect: boolean;
	correctAnswer?: string;
	translation?: string | null;
	onContinue: () => void;
}

export function FeedbackBanner({ isCorrect, correctAnswer, translation, onContinue }: FeedbackBannerProps) {
	return (
		<div
			className={cn(
				"fixed bottom-0 left-0 right-0 z-50 px-6 py-4 transition-all animate-in slide-in-from-bottom-4 duration-300",
				isCorrect ? "bg-duo-green-light" : "bg-duo-red-light"
			)}
		>
			<div className="flex items-center gap-3 mb-3">
				{isCorrect ? (
					<>
						<CheckCircle2 size={28} className="text-duo-green" />
						<span className="text-lg font-bold text-duo-green">Great job!</span>
					</>
				) : (
					<>
						<XCircle size={28} className="text-duo-red" />
						<span className="text-lg font-bold text-duo-red">Incorrect</span>
					</>
				)}
			</div>

			{isCorrect && translation && (
				<p className="text-sm text-duo-green-dark mb-3">
					Translation: <strong>{translation}</strong>
				</p>
			)}

			{!isCorrect && correctAnswer && (
				<p className="text-sm text-duo-red-dark mb-3">
					Correct answer: <strong>{correctAnswer}</strong>
				</p>
			)}

			<button
				onClick={onContinue}
				className={cn(
					"w-full py-3 rounded-2xl text-white font-bold text-base border-b-4 transition-all active:scale-[0.98] active:border-b-2",
					isCorrect
						? "bg-duo-green border-duo-green-dark"
						: "bg-duo-red border-duo-red-dark"
				)}
			>
				Continue
			</button>
		</div>
	);
}
