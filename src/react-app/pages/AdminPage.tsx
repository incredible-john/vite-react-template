import { useState, useEffect, useCallback } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Routes, Route } from "react-router";
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subject, Lesson, ChallengeType } from "@/lib/types";

const API = "/api/admin";

interface Unit {
	id: number;
	subjectId: number;
	title: string;
	description: string;
	order: number;
}

interface ChallengeRow {
	id: number;
	lessonId: number;
	type: ChallengeType;
	question: string;
	order: number;
}

function AdminDashboard() {
	const [stats, setStats] = useState({ subjects: 0, units: 0, lessons: 0, challenges: 0 });

	useEffect(() => {
		Promise.all([
			fetch(`${API}/subjects`).then((r) => r.json()) as Promise<unknown[]>,
			fetch(`${API}/units`).then((r) => r.json()) as Promise<unknown[]>,
			fetch(`${API}/lessons`).then((r) => r.json()) as Promise<unknown[]>,
			fetch(`${API}/challenges`).then((r) => r.json()) as Promise<unknown[]>,
		]).then(([s, u, l, c]) => {
			setStats({ subjects: s.length, units: u.length, lessons: l.length, challenges: c.length });
		});
	}, []);

	const cards = [
		{ label: "Subjects", count: stats.subjects, color: "bg-duo-green" },
		{ label: "Units", count: stats.units, color: "bg-duo-blue" },
		{ label: "Lessons", count: stats.lessons, color: "bg-duo-purple" },
		{ label: "Challenges", count: stats.challenges, color: "bg-duo-orange" },
	];

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Dashboard</h1>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{cards.map((card) => (
					<div key={card.label} className={cn("rounded-2xl p-6 text-white", card.color)}>
						<p className="text-3xl font-bold">{card.count}</p>
						<p className="text-sm opacity-80">{card.label}</p>
					</div>
				))}
			</div>
		</div>
	);
}

// --- Generic CRUD List ---

function useCrud<T extends { id: number }>(endpoint: string) {
	const [items, setItems] = useState<T[]>([]);
	const [loading, setLoading] = useState(true);

	const load = useCallback(() => {
		setLoading(true);
		fetch(`${API}/${endpoint}`)
			.then((r) => r.json() as Promise<T[]>)
			.then(setItems)
			.finally(() => setLoading(false));
	}, [endpoint]);

	useEffect(() => { load(); }, [load]);

	const create = async (data: Partial<T>) => {
		await fetch(`${API}/${endpoint}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		load();
	};

	const update = async (id: number, data: Partial<T>) => {
		await fetch(`${API}/${endpoint}/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		load();
	};

	const remove = async (id: number) => {
		await fetch(`${API}/${endpoint}/${id}`, { method: "DELETE" });
		load();
	};

	return { items, loading, create, update, remove, reload: load };
}

// --- Subjects Manager ---

function SubjectsManager() {
	const { items, create, update, remove } = useCrud<Subject>("subjects");
	const [editing, setEditing] = useState<Subject | null>(null);
	const [form, setForm] = useState({ title: "", description: "", order: 0 });
	const [showForm, setShowForm] = useState(false);

	const openNew = () => {
		setEditing(null);
		setForm({ title: "", description: "", order: items.length });
		setShowForm(true);
	};

	const openEdit = (item: Subject) => {
		setEditing(item);
		setForm({ title: item.title, description: item.description, order: item.order });
		setShowForm(true);
	};

	const handleSubmit = async () => {
		if (editing) {
			await update(editing.id, form);
		} else {
			await create(form);
		}
		setShowForm(false);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Subjects</h1>
				<button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-duo-green text-white font-semibold text-sm">
					<Plus size={16} /> Add Subject
				</button>
			</div>

			{showForm && (
				<div className="mb-6 p-4 border-2 border-border rounded-2xl bg-muted/30 space-y-3">
					<input
						placeholder="Title"
						value={form.title}
						onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none"
					/>
					<input
						placeholder="Description"
						value={form.description}
						onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none"
					/>
					<input
						type="number"
						placeholder="Order"
						value={form.order}
						onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
						className="w-24 px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none"
					/>
					<div className="flex gap-2">
						<button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-duo-green text-white text-sm font-semibold">
							{editing ? "Update" : "Create"}
						</button>
						<button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border-2 border-border text-sm">
							Cancel
						</button>
					</div>
				</div>
			)}

			<div className="space-y-2">
				{items.map((item) => (
					<div key={item.id} className="flex items-center justify-between p-4 border-2 border-border rounded-xl">
						<div>
							<p className="font-semibold">{item.title}</p>
							<p className="text-sm text-muted-foreground">{item.description}</p>
						</div>
						<div className="flex gap-2">
							<button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-muted"><Pencil size={16} /></button>
							<button onClick={() => remove(item.id)} className="p-2 rounded-lg hover:bg-duo-red-light text-duo-red"><Trash2 size={16} /></button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// --- Units Manager ---

function UnitsManager() {
	const { items, create, update, remove } = useCrud<Unit>("units");
	const { items: subjects } = useCrud<Subject>("subjects");
	const [editing, setEditing] = useState<Unit | null>(null);
	const [form, setForm] = useState({ title: "", description: "", subjectId: 0, order: 0 });
	const [showForm, setShowForm] = useState(false);

	const openNew = () => {
		setEditing(null);
		setForm({ title: "", description: "", subjectId: subjects[0]?.id ?? 0, order: items.length });
		setShowForm(true);
	};

	const openEdit = (item: Unit) => {
		setEditing(item);
		setForm({ title: item.title, description: item.description, subjectId: item.subjectId, order: item.order });
		setShowForm(true);
	};

	const handleSubmit = async () => {
		if (editing) await update(editing.id, form);
		else await create(form);
		setShowForm(false);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Units</h1>
				<button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-duo-green text-white font-semibold text-sm">
					<Plus size={16} /> Add Unit
				</button>
			</div>

			{showForm && (
				<div className="mb-6 p-4 border-2 border-border rounded-2xl bg-muted/30 space-y-3">
					<select
						value={form.subjectId}
						onChange={(e) => setForm((f) => ({ ...f, subjectId: Number(e.target.value) }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none"
					>
						<option value={0}>Select subject...</option>
						{subjects.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
					</select>
					<input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none" />
					<input placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none" />
					<input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
						className="w-24 px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none" />
					<div className="flex gap-2">
						<button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-duo-green text-white text-sm font-semibold">{editing ? "Update" : "Create"}</button>
						<button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border-2 border-border text-sm">Cancel</button>
					</div>
				</div>
			)}

			<div className="space-y-2">
				{items.map((item) => {
					const subject = subjects.find((s) => s.id === item.subjectId);
					return (
						<div key={item.id} className="flex items-center justify-between p-4 border-2 border-border rounded-xl">
							<div>
								<p className="font-semibold">{item.title}</p>
								<p className="text-sm text-muted-foreground">{subject?.title ?? "Unknown subject"} &middot; {item.description}</p>
							</div>
							<div className="flex gap-2">
								<button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-muted"><Pencil size={16} /></button>
								<button onClick={() => remove(item.id)} className="p-2 rounded-lg hover:bg-duo-red-light text-duo-red"><Trash2 size={16} /></button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

// --- Lessons Manager ---

function LessonsManager() {
	const { items, create, update, remove } = useCrud<Lesson>("lessons");
	const { items: units } = useCrud<Unit>("units");
	const [editing, setEditing] = useState<Lesson | null>(null);
	const [form, setForm] = useState({ title: "", unitId: 0, order: 0 });
	const [showForm, setShowForm] = useState(false);

	const openNew = () => {
		setEditing(null);
		setForm({ title: "", unitId: units[0]?.id ?? 0, order: items.length });
		setShowForm(true);
	};

	const openEdit = (item: Lesson) => {
		setEditing(item);
		setForm({ title: item.title, unitId: item.unitId, order: item.order });
		setShowForm(true);
	};

	const handleSubmit = async () => {
		if (editing) await update(editing.id, form);
		else await create(form);
		setShowForm(false);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Lessons</h1>
				<button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-duo-green text-white font-semibold text-sm">
					<Plus size={16} /> Add Lesson
				</button>
			</div>

			{showForm && (
				<div className="mb-6 p-4 border-2 border-border rounded-2xl bg-muted/30 space-y-3">
					<select value={form.unitId} onChange={(e) => setForm((f) => ({ ...f, unitId: Number(e.target.value) }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none">
						<option value={0}>Select unit...</option>
						{units.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}
					</select>
					<input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none" />
					<input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
						className="w-24 px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none" />
					<div className="flex gap-2">
						<button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-duo-green text-white text-sm font-semibold">{editing ? "Update" : "Create"}</button>
						<button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border-2 border-border text-sm">Cancel</button>
					</div>
				</div>
			)}

			<div className="space-y-2">
				{items.map((item) => {
					const unit = units.find((u) => u.id === item.unitId);
					return (
						<div key={item.id} className="flex items-center justify-between p-4 border-2 border-border rounded-xl">
							<div>
								<p className="font-semibold">{item.title}</p>
								<p className="text-sm text-muted-foreground">{unit?.title ?? "Unknown unit"}</p>
							</div>
							<div className="flex gap-2">
								<button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-muted"><Pencil size={16} /></button>
								<button onClick={() => remove(item.id)} className="p-2 rounded-lg hover:bg-duo-red-light text-duo-red"><Trash2 size={16} /></button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

// --- Challenges Manager ---

interface OptionForm {
	text: string;
	isCorrect: boolean;
	order: number;
}

function ChallengesManager() {
	const { items, remove } = useCrud<ChallengeRow>("challenges");
	const { items: lessons } = useCrud<Lesson>("lessons");
	const [showForm, setShowForm] = useState(false);
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const [form, setForm] = useState<{
		lessonId: number;
		type: ChallengeType;
		question: string;
		order: number;
		options: OptionForm[];
	}>({
		lessonId: 0,
		type: "TRANSLATE",
		question: "",
		order: 0,
		options: [{ text: "", isCorrect: true, order: 0 }],
	});

	const openNew = () => {
		setForm({
			lessonId: lessons[0]?.id ?? 0,
			type: "TRANSLATE",
			question: "",
			order: items.length,
			options: [{ text: "", isCorrect: true, order: 0 }],
		});
		setShowForm(true);
	};

	const handleSubmit = async () => {
		const { options, ...challengeData } = form;
		const res = await fetch(`${API}/challenges`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(challengeData),
		});
		const created = (await res.json()) as { id: number };

		for (const opt of options) {
			await fetch(`${API}/challenge-options`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...opt, challengeId: created.id }),
			});
		}
		setShowForm(false);
		window.location.reload();
	};

	const addOption = () => {
		setForm((f) => ({
			...f,
			options: [...f.options, { text: "", isCorrect: false, order: f.options.length }],
		}));
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">Challenges</h1>
				<button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-duo-green text-white font-semibold text-sm">
					<Plus size={16} /> Add Challenge
				</button>
			</div>

			{showForm && (
				<div className="mb-6 p-4 border-2 border-border rounded-2xl bg-muted/30 space-y-3">
					<select value={form.lessonId} onChange={(e) => setForm((f) => ({ ...f, lessonId: Number(e.target.value) }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none">
						<option value={0}>Select lesson...</option>
						{lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
					</select>
					<select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ChallengeType }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none">
						<option value="TRANSLATE">Translate</option>
						<option value="FILL_BLANK">Fill in the blank</option>
						<option value="MATCH_PAIRS">Match pairs</option>
						<option value="SELECT_TRANSLATION">Select translation</option>
					</select>
					<input placeholder="Question" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
						className="w-full px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none" />

					<div className="space-y-2">
						<p className="text-sm font-semibold">Options:</p>
						{form.options.map((opt, i) => (
							<div key={i} className="flex gap-2 items-center">
								<input placeholder={`Option ${i + 1}`} value={opt.text}
									onChange={(e) => {
										const opts = [...form.options];
										opts[i] = { ...opts[i], text: e.target.value };
										setForm((f) => ({ ...f, options: opts }));
									}}
									className="flex-1 px-3 py-2 rounded-xl border-2 border-border text-sm focus:border-duo-green focus:outline-none" />
								<label className="flex items-center gap-1 text-sm whitespace-nowrap">
									<input type="checkbox" checked={opt.isCorrect}
										onChange={(e) => {
											const opts = [...form.options];
											opts[i] = { ...opts[i], isCorrect: e.target.checked };
											setForm((f) => ({ ...f, options: opts }));
										}} />
									Correct
								</label>
							</div>
						))}
						<button onClick={addOption} className="text-sm text-duo-blue font-semibold">+ Add option</button>
					</div>

					<div className="flex gap-2">
						<button onClick={handleSubmit} className="px-4 py-2 rounded-xl bg-duo-green text-white text-sm font-semibold">Create</button>
						<button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border-2 border-border text-sm">Cancel</button>
					</div>
				</div>
			)}

			<div className="space-y-2">
				{items.map((item) => {
					const lesson = lessons.find((l) => l.id === item.lessonId);
					const isExpanded = expandedId === item.id;
					return (
						<div key={item.id} className="border-2 border-border rounded-xl">
							<div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : item.id)}>
								<div className="flex items-center gap-2">
									{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
									<div>
										<p className="font-semibold">{item.question}</p>
										<p className="text-sm text-muted-foreground">{item.type} &middot; {lesson?.title ?? "Unknown"}</p>
									</div>
								</div>
								<button onClick={(e) => { e.stopPropagation(); remove(item.id); }} className="p-2 rounded-lg hover:bg-duo-red-light text-duo-red">
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export function AdminPage() {
	return (
		<AdminShell>
			<Routes>
				<Route index element={<AdminDashboard />} />
				<Route path="subjects" element={<SubjectsManager />} />
				<Route path="units" element={<UnitsManager />} />
				<Route path="lessons" element={<LessonsManager />} />
				<Route path="challenges" element={<ChallengesManager />} />
			</Routes>
		</AdminShell>
	);
}
