import { Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioButtonProps {
	audioUrl?: string | null;
	size?: "sm" | "md";
	className?: string;
}

export function AudioButton({ size = "md", className }: AudioButtonProps) {
	const handlePlay = () => {
		// Audio playback will be implemented when audio URLs are available
		// For now this is a visual placeholder
	};

	return (
		<button
			onClick={handlePlay}
			className={cn(
				"flex items-center justify-center rounded-xl bg-duo-blue text-white transition-all active:scale-95",
				size === "sm" ? "h-8 w-8" : "h-10 w-10",
				className
			)}
		>
			<Volume2 size={size === "sm" ? 16 : 20} />
		</button>
	);
}
