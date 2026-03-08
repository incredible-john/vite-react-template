import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Star, Lock } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { getUnitsForSubject } from "@/lib/api";
import type { UnitWithLessons } from "@/lib/types";
import { cn } from "@/lib/utils";

const unitColors = [
	{ bg: "bg-duo-green", ring: "ring-duo-green/30", text: "text-white" },
	{ bg: "bg-duo-blue", ring: "ring-duo-blue/30", text: "text-white" },
	{ bg: "bg-duo-purple", ring: "ring-duo-purple/30", text: "text-white" },
	{ bg: "bg-duo-orange", ring: "ring-duo-orange/30", text: "text-white" },
];

export function UnitsPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [units, setUnits] = useState<UnitWithLessons[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!id) return;
		getUnitsForSubject(Number(id))
			.then(setUnits)
			.finally(() => setLoading(false));
	}, [id]);

	return (
		<MobileShell>
			<header className="flex items-center gap-3 px-4 pt-6 pb-4">
				<button
					onClick={() => navigate("/")}
					className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-white transition-colors hover:bg-muted"
				>
					<ArrowLeft size={20} />
				</button>
				<h1 className="text-xl font-bold">Units</h1>
			</header>

			<main className="flex-1 px-4 pb-8">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="h-8 w-8 rounded-full border-4 border-duo-green border-t-transparent animate-spin" />
					</div>
				) : (
					<div className="space-y-8">
						{units.map((unit, unitIdx) => {
							const color = unitColors[unitIdx % unitColors.length];
							return (
								<section key={unit.id}>
									<div className={cn("rounded-2xl p-4 mb-4", color.bg, color.text)}>
										<h2 className="text-lg font-bold">
											Unit {unitIdx + 1}: {unit.title}
										</h2>
										{unit.description && (
											<p className="text-sm opacity-80 mt-1">{unit.description}</p>
										)}
									</div>

									<div className="flex flex-col items-center gap-4">
										{unit.lessons.map((lesson, lessonIdx) => {
											const isFirst = lessonIdx === 0;
											return (
												<Link
													key={lesson.id}
													to={`/lessons/${lesson.id}`}
													className={cn(
														"relative flex h-16 w-16 items-center justify-center rounded-full border-b-4 transition-all active:scale-95 active:border-b-2",
														isFirst
															? `${color.bg} border-${color.bg === "bg-duo-green" ? "duo-green-dark" : "black/20"} ${color.text} shadow-lg`
															: "bg-duo-gray border-duo-gray-dark text-muted-foreground"
													)}
													style={{
														marginLeft: `${Math.sin(lessonIdx * 1.2) * 40}px`,
													}}
												>
													{isFirst ? (
														<Star size={28} fill="currentColor" />
													) : (
														<Lock size={20} />
													)}
												</Link>
											);
										})}
									</div>
								</section>
							);
						})}
					</div>
				)}
			</main>
		</MobileShell>
	);
}
