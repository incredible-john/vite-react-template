import { X, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

interface ChallengeHeaderProps {
	progress: number;
	hearts: number;
	maxHearts: number;
}

export function ChallengeHeader({ progress, hearts, maxHearts }: ChallengeHeaderProps) {
	const navigate = useNavigate();

	return (
		<div className="flex items-center gap-3 px-4 pt-4 pb-2">
			<button
				onClick={() => navigate(-1)}
				className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
			>
				<X size={22} strokeWidth={2.5} />
			</button>

			<div className="flex-1 h-4 rounded-full bg-duo-gray overflow-hidden">
				<div
					className={cn(
						"h-full rounded-full bg-duo-green transition-all duration-500 ease-out",
						progress > 0 && "min-w-[12px]"
					)}
					style={{ width: `${Math.min(progress * 100, 100)}%` }}
				/>
			</div>

			<div className="flex items-center gap-0.5">
				{Array.from({ length: maxHearts }).map((_, i) => (
					<Heart
						key={i}
						size={22}
						className={cn(
							"transition-all duration-300",
							i < hearts
								? "text-duo-orange fill-duo-orange"
								: "text-duo-gray fill-duo-gray"
						)}
					/>
				))}
			</div>
		</div>
	);
}
