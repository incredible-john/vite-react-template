import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { playTts } from "@/lib/sounds";
import { getCachedTranslation, fetchTranslation } from "@/lib/preloadCache";
import type { ChallengeToken, LanguageCode } from "@/lib/types";

interface InteractiveWordProps {
	word: string;
	className?: string;
	/** From challenge_tokens.translation when available */
	prefetchedTranslation?: ChallengeToken[];
	sourceLang?: LanguageCode;
	targetLang?: LanguageCode;
	playAudioOnClick?: boolean;
}

export function InteractiveWord({
	word,
	className,
	prefetchedTranslation,
	sourceLang = "en",
	targetLang = "zh",
	playAudioOnClick = true,
}: InteractiveWordProps) {
	const [translation, setTranslation] = useState<string | null>(null);
	const [showTooltip, setShowTooltip] = useState(false);
	const [loading, setLoading] = useState(false);
	const [playing, setPlaying] = useState(false);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setShowTooltip(true);

		// Translation: never blocked by TTS; use cache synchronously when available
		if (!translation) {
			const cached = getCachedTranslation(word, sourceLang, targetLang);
			if (cached) {
				setTranslation(cached);
			} else {
				setLoading(true);
				void fetchTranslation(word, sourceLang, targetLang)
					.then((result) => {
						if (result) setTranslation(result);
					})
					.catch((error) => {
						console.error("Translation error:", error);
					})
					.finally(() => {
						setLoading(false);
					});
			}
		}

		if (playAudioOnClick) {
			const audio = playTts(`/api/audio/tts?text=${encodeURIComponent(word)}`);
			setPlaying(true);
			audio.addEventListener("ended", () => setPlaying(false));
			audio.addEventListener("error", () => setPlaying(false));
		}
	};

	// Close tooltip when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				buttonRef.current?.contains(target) ||
				tooltipRef.current?.contains(target)
			) {
				return;
			}
			setShowTooltip(false);
		};

		if (showTooltip) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showTooltip]);

	return (
		<span className="relative inline-block">
			<button
				ref={buttonRef}
				type="button"
				onClick={handleClick}
				className={cn(
					"relative inline-block cursor-pointer rounded px-0.5 transition-colors hover:bg-duo-blue/20 select-none",
					playing && "text-duo-blue",
					className
				)}
			>
				{word}
			</button>

			{showTooltip && (
				<div
					ref={tooltipRef}
					className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap"
				>
					{loading ? (
						<span className="text-gray-400">Loading...</span>
					) : translation ? (
						<>
							{prefetchedTranslation && prefetchedTranslation.length > 0 ? (
								<p>{word} {translation}</p>
							) : (
								<p>{translation}</p>
							)}
							{prefetchedTranslation?.map((t, i) => (
								<p key={i}>
									{t.text} {t.translation}
								</p>
							))}
						</>
					) : null}
					<div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
				</div>
			)}
		</span>
	);
}
