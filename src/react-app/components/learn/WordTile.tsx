import { cn } from "@/lib/utils";

interface WordTileProps {
	text: string;
	onClick?: () => void;
	disabled?: boolean;
	selected?: boolean;
	variant?: "bank" | "answer";
}

export function WordTile({
	text,
	onClick,
	disabled = false,
	selected = false,
	variant = "bank",
}: WordTileProps) {
	if (selected && variant === "bank") {
		return (
			<div className="h-10 rounded-xl bg-duo-gray/50 border-2 border-dashed border-duo-gray px-4 min-w-[3rem]" />
		);
	}

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all",
				"border-b-[3px] active:border-b-[1px] active:translate-y-[2px]",
				variant === "bank"
					? "bg-white border-border border-2 border-b-[3px] border-b-duo-gray-dark text-foreground shadow-sm hover:bg-muted/50"
					: "bg-duo-green-light border-duo-green text-duo-green-dark border-2 border-b-[3px]",
				disabled && "opacity-50 pointer-events-none"
			)}
		>
			{text}
		</button>
	);
}
