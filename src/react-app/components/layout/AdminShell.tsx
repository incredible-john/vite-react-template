import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import {
	BookOpen,
	Layers,
	GraduationCap,
	Puzzle,
	LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "Dashboard", href: "/admin", icon: LayoutDashboard },
	{ label: "Subjects", href: "/admin/subjects", icon: BookOpen },
	{ label: "Units", href: "/admin/units", icon: Layers },
	{ label: "Lessons", href: "/admin/lessons", icon: GraduationCap },
	{ label: "Challenges", href: "/admin/challenges", icon: Puzzle },
];

export function AdminShell({ children }: { children: ReactNode }) {
	const location = useLocation();

	return (
		<div className="flex min-h-dvh">
			{/* Desktop-only guard */}
			<div className="md:hidden flex items-center justify-center w-full p-8 text-center text-muted-foreground">
				<p className="text-lg">Please use a desktop browser to access the admin panel.</p>
			</div>

			{/* Sidebar */}
			<aside className="hidden md:flex w-64 border-r border-border bg-muted/30 flex-col p-4 gap-1">
				<Link to="/admin" className="text-xl font-bold text-duo-green mb-6 px-3">
					Juolingo Admin
				</Link>
				{navItems.map((item) => {
					const Icon = item.icon;
					const active =
						location.pathname === item.href ||
						(item.href !== "/admin" &&
							location.pathname.startsWith(item.href));
					return (
						<Link
							key={item.href}
							to={item.href}
							className={cn(
								"flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
								active
									? "bg-duo-green/10 text-duo-green"
									: "text-muted-foreground hover:bg-muted hover:text-foreground"
							)}
						>
							<Icon size={18} />
							{item.label}
						</Link>
					);
				})}
			</aside>

			{/* Main content */}
			<main className="hidden md:block flex-1 p-8 overflow-auto">
				{children}
			</main>
		</div>
	);
}
