import type { ReactNode } from "react";

export function MobileShell({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-dvh w-full max-w-lg mx-auto flex flex-col">
			{children}
		</div>
	);
}
