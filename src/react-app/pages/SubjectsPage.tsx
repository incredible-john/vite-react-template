import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BookOpen, Sparkles, Globe, Newspaper } from "lucide-react";
import { MobileShell } from "@/components/layout/MobileShell";
import { getSubjects } from "@/lib/api";
import type { Subject } from "@/lib/types";

const iconMap: Record<string, typeof BookOpen> = {
	biography: Sparkles,
	story: BookOpen,
	news: Newspaper,
	default: Globe,
};

const colorMap: string[] = [
	"from-duo-green to-emerald-400",
	"from-duo-blue to-cyan-400",
	"from-duo-purple to-violet-400",
	"from-duo-orange to-amber-400",
];

function SubjectsPageHeader() {
	return (
		<header className="px-4 pt-8 pb-4 sm:px-6">
			<h1 className="text-3xl font-extrabold text-foreground">
				Juolingo
			</h1>
			<p className="text-muted-foreground mt-1">Choose a topic to start learning</p>
		</header>
	);
}

function SubjectCard({ subject, gradient }: { subject: Subject; gradient: string }) {
	const Icon = iconMap[subject.imageUrl ?? "default"] ?? iconMap.default;
	return (
		<Link
			to={`/subjects/${subject.id}`}
			className="block min-w-0 w-full rounded-2xl bg-gradient-to-br p-[2px] transition-transform active:scale-[0.98]"
		>
			<div
				className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg`}
			>
				<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
					<Icon size={28} />
				</div>
				<div className="flex-1 min-w-0">
					<h2 className="text-lg font-bold truncate">
						{subject.title}
					</h2>
					{subject.description && (
						<p className="text-sm text-white/80 truncate">
							{subject.description}
						</p>
					)}
				</div>
				<div className="text-white/60">
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
						<path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
					</svg>
				</div>
			</div>
		</Link>
	);
}

export function SubjectsPage() {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSubjects()
			.then(setSubjects)
			.finally(() => setLoading(false));
	}, []);

	return (
		<MobileShell>
			<SubjectsPageHeader />
			<main className="flex-1 px-4 pb-8 sm:px-6">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="h-8 w-8 rounded-full border-4 border-duo-green border-t-transparent animate-spin" />
					</div>
				) : subjects.length === 0 ? (
					<div className="text-center py-20 text-muted-foreground">
						<Globe size={48} className="mx-auto mb-4 opacity-50" />
						<p>No subjects available yet.</p>
						<p className="text-sm mt-1">Add some in the admin panel.</p>
					</div>
				) : (
					<div className="grid min-w-0 gap-4">
						{subjects.map((subject, i) => (
							<SubjectCard
								key={subject.id}
								subject={subject}
								gradient={colorMap[i % colorMap.length]}
							/>
						))}
					</div>
				)}
			</main>
		</MobileShell>
	);
}
