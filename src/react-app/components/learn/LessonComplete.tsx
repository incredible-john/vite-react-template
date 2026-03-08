import { useEffect } from "react";
import { useNavigate } from "react-router";
import { playFinishSound } from "@/lib/sounds";

interface LessonCompleteProps {
	hearts: number;
	maxHearts: number;
}

export function LessonComplete({ hearts, maxHearts }: LessonCompleteProps) {
	const navigate = useNavigate();

	useEffect(() => {
		playFinishSound();
	}, []);

	return (
		<div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
			{/* 完成图标 */}
			<div className="mb-6">
				<img
					src="/finish.svg"
					alt="Complete"
					className="w-32 h-32"
				/>
			</div>

			{/* 标题 */}
			<h2 className="text-3xl font-bold text-duo-green mb-2">
				Lesson Complete!
			</h2>

			{/* 剩余红心 */}
			<div className="flex items-center gap-2 mb-8">
				<span className="text-2xl">❤️</span>
				<span className="text-xl font-bold">
					{hearts}/{maxHearts}
				</span>
			</div>

			{/* 按钮组 */}
			<div className="flex flex-col gap-3 w-full max-w-xs">
				<button
					onClick={() => navigate("/")}
					className="px-8 py-3 rounded-2xl bg-duo-green text-white font-bold border-b-4 border-duo-green-dark active:border-b-0 active:translate-y-1 transition-all"
				>
					Continue
				</button>
			</div>
		</div>
	);
}
