import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import {
	getSubjects,
	getUnits,
	getLessons,
	getChallenges,
	getChallengeOptions,
	createSubject,
	updateSubject,
	deleteSubject,
	createUnit,
	updateUnit,
	deleteUnit,
	createLesson,
	updateLesson,
	deleteLesson,
	createChallenge,
	updateChallenge,
	deleteChallenge,
	createChallengeOption,
	updateChallengeOption,
	deleteChallengeOption,
} from "@/lib/api";
import type { Subject, Challenge, ChallengeOption, ChallengeType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Plus, Pencil, Trash2, GripVertical, Settings2 } from "lucide-react";

interface Unit {
	id: number;
	subjectId: number;
	title: string;
	description: string;
	order: number;
}

interface Lesson {
	id: number;
	unitId: number;
	title: string;
	order: number;
}

interface SelectedItem {
	subject: Subject | null;
	unit: Unit | null;
	lesson: Lesson | null;
	challenge: Challenge | null;
}

type DialogType = "subject" | "unit" | "lesson" | "challenge" | "option";

interface FormData {
	title?: string;
	description?: string;
	question?: string;
	type?: ChallengeType;
	text?: string;
	isCorrect?: boolean;
}

export default function AdminPage() {
	const navigate = useNavigate();
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [units, setUnits] = useState<Unit[]>([]);
	const [lessons, setLessons] = useState<Lesson[]>([]);
	const [challenges, setChallenges] = useState<Challenge[]>([]);
	const [challengeOptions, setChallengeOptions] = useState<ChallengeOption[]>([]);

	const [selected, setSelected] = useState<SelectedItem>({
		subject: null,
		unit: null,
		lesson: null,
		challenge: null,
	});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogType, setDialogType] = useState<DialogType | null>(null);
	const [editingItem, setEditingItem] = useState<Subject | Unit | Lesson | Challenge | ChallengeOption | null>(null);
	const [formData, setFormData] = useState<FormData>({});

	const loadSubjects = useCallback(async () => {
		const data = await getSubjects();
		setSubjects(data);
	}, []);

	// Load subjects on mount
	useEffect(() => {
		async function run() {
			await loadSubjects();
		}
		void run();
	}, [loadSubjects]);

	// Load units when subject is selected
	useEffect(() => {
		async function run() {
			setSelected((s) => ({ ...s, unit: null, lesson: null, challenge: null }));
			setLessons([]);
			setChallenges([]);
			setChallengeOptions([]);
			if (selected.subject) {
				setUnits(await getUnits(selected.subject.id));
			} else {
				setUnits([]);
			}
		}
		void run();
	}, [selected.subject]);

	// Load lessons when unit is selected
	useEffect(() => {
		async function run() {
			setSelected((s) => ({ ...s, lesson: null, challenge: null }));
			setChallenges([]);
			setChallengeOptions([]);
			if (selected.unit) {
				setLessons(await getLessons(selected.unit.id));
			} else {
				setLessons([]);
			}
		}
		void run();
	}, [selected.unit]);

	// Load challenges when lesson is selected
	useEffect(() => {
		async function run() {
			setSelected((s) => ({ ...s, challenge: null }));
			setChallengeOptions([]);
			if (selected.lesson) {
				setChallenges(await getChallenges(selected.lesson.id));
			} else {
				setChallenges([]);
			}
		}
		void run();
	}, [selected.lesson]);

	// Load options when challenge is selected
	useEffect(() => {
		async function run() {
			if (selected.challenge) {
				setChallengeOptions(await getChallengeOptions(selected.challenge.id));
			} else {
				setChallengeOptions([]);
			}
		}
		void run();
	}, [selected.challenge]);

	function openDialog(type: DialogType, item?: Subject | Unit | Lesson | Challenge | ChallengeOption) {
		setDialogType(type);
		setEditingItem(item || null);
		if (item) {
			if (type === "subject") {
				const s = item as Subject;
				setFormData({ title: s.title, description: s.description });
			} else if (type === "unit") {
				const u = item as Unit;
				setFormData({ title: u.title, description: u.description });
			} else if (type === "lesson") {
				const l = item as Lesson;
				setFormData({ title: l.title });
			} else if (type === "challenge") {
				const c = item as Challenge;
				setFormData({ question: c.question, type: c.type });
			} else if (type === "option") {
				const o = item as ChallengeOption;
				setFormData({ text: o.text, isCorrect: o.isCorrect });
			}
		} else {
			setFormData(getDefaultFormData(type));
		}
		setDialogOpen(true);
	}

	function getDefaultFormData(type: DialogType): FormData {
		switch (type) {
			case "subject":
				return { title: "", description: "" };
			case "unit":
				return { title: "", description: "" };
			case "lesson":
				return { title: "" };
			case "challenge":
				return { question: "", type: "TRANSLATE" };
			case "option":
				return { text: "", isCorrect: false };
			default:
				return {};
		}
	}

	async function handleSave() {
		if (!dialogType) return;

		try {
			if (dialogType === "subject") {
				if (editingItem) {
					await updateSubject(editingItem.id as number, { title: formData.title!, description: formData.description! });
				} else {
					await createSubject({ title: formData.title!, description: formData.description! });
				}
				loadSubjects();
			} else if (dialogType === "unit") {
				if (editingItem) {
					await updateUnit(editingItem.id as number, { title: formData.title!, description: formData.description! });
				} else if (selected.subject) {
					await createUnit({ subjectId: selected.subject.id, title: formData.title!, description: formData.description! });
				}
				if (selected.subject) {
					getUnits(selected.subject.id).then(setUnits);
				}
			} else if (dialogType === "lesson") {
				if (editingItem) {
					await updateLesson(editingItem.id as number, { title: formData.title! });
				} else if (selected.unit) {
					await createLesson({ unitId: selected.unit.id, title: formData.title! });
				}
				if (selected.unit) {
					getLessons(selected.unit.id).then(setLessons);
				}
			} else if (dialogType === "challenge") {
				if (editingItem) {
					await updateChallenge(editingItem.id as number, { question: formData.question!, type: formData.type! });
				} else if (selected.lesson) {
					await createChallenge({ lessonId: selected.lesson.id, question: formData.question!, type: formData.type! });
				}
				if (selected.lesson) {
					getChallenges(selected.lesson.id).then(setChallenges);
				}
			} else if (dialogType === "option") {
				if (editingItem) {
					await updateChallengeOption(editingItem.id as number, { text: formData.text!, isCorrect: formData.isCorrect! });
				} else if (selected.challenge) {
					await createChallengeOption({ challengeId: selected.challenge.id, text: formData.text!, isCorrect: formData.isCorrect! });
				}
				if (selected.challenge) {
					getChallengeOptions(selected.challenge.id).then(setChallengeOptions);
				}
			}
			setDialogOpen(false);
		} catch (error) {
			console.error("Error saving:", error);
		}
	}

	async function handleDelete(type: DialogType, id: number) {
		if (!confirm("Are you sure you want to delete this item?")) return;

		try {
			if (type === "subject") {
				await deleteSubject(id);
				loadSubjects();
				setSelected((s) => ({ ...s, subject: null }));
			} else if (type === "unit") {
				await deleteUnit(id);
				if (selected.subject) {
					getUnits(selected.subject.id).then(setUnits);
				}
				setSelected((s) => ({ ...s, unit: null }));
			} else if (type === "lesson") {
				await deleteLesson(id);
				if (selected.unit) {
					getLessons(selected.unit.id).then(setLessons);
				}
				setSelected((s) => ({ ...s, lesson: null }));
			} else if (type === "challenge") {
				await deleteChallenge(id);
				if (selected.lesson) {
					getChallenges(selected.lesson.id).then(setChallenges);
				}
				setSelected((s) => ({ ...s, challenge: null }));
			} else if (type === "option") {
				await deleteChallengeOption(id);
				if (selected.challenge) {
					getChallengeOptions(selected.challenge.id).then(setChallengeOptions);
				}
			}
		} catch (error) {
			console.error("Error deleting:", error);
		}
	}

	async function handleReorderSubjects(fromIndex: number, toIndex: number) {
		const newOrder = [...subjects];
		const [moved] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, moved);
		// Update order values
		await Promise.all(newOrder.map((item, index) => updateSubject(item.id, { order: index })));
		loadSubjects();
	}

	async function handleReorderUnits(fromIndex: number, toIndex: number) {
		const newOrder = [...units];
		const [moved] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, moved);
		await Promise.all(newOrder.map((item, index) => updateUnit(item.id, { order: index })));
		if (selected.subject) {
			getUnits(selected.subject.id).then(setUnits);
		}
	}

	async function handleReorderLessons(fromIndex: number, toIndex: number) {
		const newOrder = [...lessons];
		const [moved] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, moved);
		await Promise.all(newOrder.map((item, index) => updateLesson(item.id, { order: index })));
		if (selected.unit) {
			getLessons(selected.unit.id).then(setLessons);
		}
	}

	async function handleReorderChallenges(fromIndex: number, toIndex: number) {
		const newOrder = [...challenges];
		const [moved] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, moved);
		await Promise.all(newOrder.map((item, index) => updateChallenge(item.id, { order: index })));
		if (selected.lesson) {
			getChallenges(selected.lesson.id).then(setChallenges);
		}
	}

	async function handleReorderOptions(fromIndex: number, toIndex: number) {
		const newOrder = [...challengeOptions];
		const [moved] = newOrder.splice(fromIndex, 1);
		newOrder.splice(toIndex, 0, moved);
		await Promise.all(newOrder.map((item, index) => updateChallengeOption(item.id, { order: index })));
		if (selected.challenge) {
			getChallengeOptions(selected.challenge.id).then(setChallengeOptions);
		}
	}

	const challengeTypes: ChallengeType[] = [
		"TRANSLATE",
		"FILL_BLANK",
		"MATCH_PAIRS",
		"SELECT_TRANSLATION",
		"SINGLE_SELECT",
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b bg-white px-4 py-3 flex items-center gap-4">
				<Button variant="ghost" size="icon" onClick={() => navigate("/")}>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-xl font-semibold flex items-center gap-2">
					<Settings2 className="h-5 w-5" />
					Admin Panel
				</h1>
			</header>

			{/* 5 Column Layout */}
			<div className="flex h-[calc(100vh-64px)] overflow-hidden">
				{/* Column 1: Subjects */}
				<Column
					title="Subjects"
					items={subjects}
					selectedId={selected.subject?.id ?? null}
					onSelect={(item) => setSelected((s) => ({ ...s, subject: item as Subject }))}
					onAdd={() => openDialog("subject")}
					onEdit={(item) => openDialog("subject", item)}
					onDelete={(item) => handleDelete("subject", item.id)}
					onReorder={handleReorderSubjects}
					renderItem={(item) => (
						<div>
							<div className="font-medium">{item.title}</div>
							<div className="text-sm text-muted-foreground">{item.description}</div>
						</div>
					)}
				/>

				{/* Column 2: Units */}
				<Column
					title="Units"
					items={units}
					selectedId={selected.unit?.id ?? null}
					onSelect={(item) => setSelected((s) => ({ ...s, unit: item as Unit }))}
					onAdd={() => selected.subject && openDialog("unit")}
					onEdit={(item) => openDialog("unit", item)}
					onDelete={(item) => handleDelete("unit", item.id)}
					onReorder={handleReorderUnits}
					disabled={!selected.subject}
					renderItem={(item) => (
						<div>
							<div className="font-medium">{item.title}</div>
							<div className="text-sm text-muted-foreground">{item.description}</div>
						</div>
					)}
				/>

				{/* Column 3: Lessons */}
				<Column
					title="Lessons"
					items={lessons}
					selectedId={selected.lesson?.id ?? null}
					onSelect={(item) => setSelected((s) => ({ ...s, lesson: item as Lesson }))}
					onAdd={() => selected.unit && openDialog("lesson")}
					onEdit={(item) => openDialog("lesson", item)}
					onDelete={(item) => handleDelete("lesson", item.id)}
					onReorder={handleReorderLessons}
					disabled={!selected.unit}
					renderItem={(item) => (
						<div className="font-medium">{item.title}</div>
					)}
				/>

				{/* Column 4: Challenges */}
				<Column
					title="Challenges"
					items={challenges}
					selectedId={selected.challenge?.id ?? null}
					onSelect={(item) => setSelected((s) => ({ ...s, challenge: item as Challenge }))}
					onAdd={() => selected.lesson && openDialog("challenge")}
					onEdit={(item) => openDialog("challenge", item)}
					onDelete={(item) => handleDelete("challenge", item.id)}
					onReorder={handleReorderChallenges}
					disabled={!selected.lesson}
					renderItem={(item) => (
						<div>
							<Badge variant="outline" className="mb-1 text-xs">{item.type}</Badge>
							<div className="text-sm font-medium">{item.question}</div>
						</div>
					)}
				/>

				{/* Column 5: Options */}
				<Column
					title="Options"
					items={challengeOptions}
					selectedId={null}
					onSelect={() => {}}
					onAdd={() => selected.challenge && openDialog("option")}
					onEdit={(item) => openDialog("option", item)}
					onDelete={(item) => handleDelete("option", item.id)}
					onReorder={handleReorderOptions}
					disabled={!selected.challenge}
					renderItem={(item) => (
						<div className="flex items-center gap-2">
							<Badge variant={item.isCorrect ? "default" : "secondary"} className="text-xs">
								{item.isCorrect ? "Correct" : "Wrong"}
							</Badge>
							<span className="truncate">{item.text}</span>
						</div>
					)}
				/>
			</div>

			{/* Edit Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingItem ? "Edit" : "Add"} {dialogType?.charAt(0).toUpperCase()}{dialogType?.slice(1)}
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-4">
						{dialogType === "subject" && (
							<>
								<div className="space-y-2">
									<label className="text-sm font-medium">Title</label>
									<Input
										value={formData.title || ""}
										onChange={(e) => setFormData({ ...formData, title: e.target.value })}
										placeholder="Subject title"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Description</label>
									<Input
										value={formData.description || ""}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										placeholder="Subject description"
									/>
								</div>
							</>
						)}
						{dialogType === "unit" && (
							<>
								<div className="space-y-2">
									<label className="text-sm font-medium">Title</label>
									<Input
										value={formData.title || ""}
										onChange={(e) => setFormData({ ...formData, title: e.target.value })}
										placeholder="Unit title"
									/>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Description</label>
									<Input
										value={formData.description || ""}
										onChange={(e) => setFormData({ ...formData, description: e.target.value })}
										placeholder="Unit description"
									/>
								</div>
							</>
						)}
						{dialogType === "lesson" && (
							<div className="space-y-2">
								<label className="text-sm font-medium">Title</label>
								<Input
									value={formData.title || ""}
									onChange={(e) => setFormData({ ...formData, title: e.target.value })}
									placeholder="Lesson title"
								/>
							</div>
						)}
						{dialogType === "challenge" && (
							<>
								<div className="space-y-2">
									<label className="text-sm font-medium">Type</label>
									<select
										className="w-full px-3 py-2 border rounded-md bg-background"
										value={formData.type || "TRANSLATE"}
										onChange={(e) => setFormData({ ...formData, type: e.target.value as ChallengeType })}
									>
										{challengeTypes.map((type) => (
											<option key={type} value={type}>{type}</option>
										))}
									</select>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium">Question</label>
									<Input
										value={formData.question || ""}
										onChange={(e) => setFormData({ ...formData, question: e.target.value })}
										placeholder="Challenge question"
									/>
								</div>
							</>
						)}
						{dialogType === "option" && (
							<>
								<div className="space-y-2">
									<label className="text-sm font-medium">Text</label>
									<Input
										value={formData.text || ""}
										onChange={(e) => setFormData({ ...formData, text: e.target.value })}
										placeholder="Option text"
									/>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="checkbox"
										id="isCorrect"
										checked={formData.isCorrect || false}
										onChange={(e) => setFormData({ ...formData, isCorrect: e.target.checked })}
									/>
									<label htmlFor="isCorrect" className="text-sm font-medium">Correct answer</label>
								</div>
							</>
						)}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
						<Button onClick={handleSave}>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

interface ColumnProps<T> {
	title: string;
	items: T[];
	selectedId: number | null;
	onSelect: (item: T) => void;
	onAdd: () => void;
	onEdit: (item: T) => void;
	onDelete: (item: T) => void;
	onReorder?: (fromIndex: number, toIndex: number) => void;
	disabled?: boolean;
	renderItem: (item: T) => React.ReactNode;
}

function Column<T extends { id: number }>({ title, items, selectedId, onSelect, onAdd, onEdit, onDelete, onReorder, disabled, renderItem }: ColumnProps<T>) {
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	function handleDragStart(e: React.DragEvent, index: number) {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = "move";
	}

	function handleDragOver(e: React.DragEvent) {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
	}

	function handleDrop(e: React.DragEvent, _toIndex: number) {
		e.preventDefault();
		if (draggedIndex !== null && onReorder) {
			onReorder(draggedIndex, _toIndex);
		}
		setDraggedIndex(null);
	}

	function handleDragEnd() {
		setDraggedIndex(null);
	}

	return (
		<div className="flex-1 min-w-[200px] border-r flex flex-col">
			<div className="p-3 border-b bg-gray-50 flex items-center justify-between">
				<h2 className="font-semibold text-sm">{title}</h2>
				<Button
					variant="ghost"
					size="icon"
					className="h-7 w-7"
					onClick={onAdd}
					disabled={disabled}
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
			<ScrollArea className="flex-1 min-h-0 overflow-hidden">
				<div className="flex flex-col p-2 space-y-1">
					{items.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground text-sm">
							{disabled ? "Select an item above" : "No items"}
						</div>
					) : (
						items.map((item, index) => (
							<div
								key={item.id}
								draggable={!!onReorder}
								onDragStart={(e) => handleDragStart(e, index)}
								onDragOver={(e) => handleDragOver(e)}
								onDrop={(e) => handleDrop(e, index)}
								onDragEnd={handleDragEnd}
								className={`
									group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
									${selectedId === item.id ? "bg-primary/10 border border-primary" : "hover:bg-gray-100 border border-transparent"}
									${draggedIndex === index ? "opacity-50" : ""}
								`}
								onClick={() => onSelect(item)}
							>
								<GripVertical className={`h-4 w-4 text-muted-foreground ${onReorder ? "opacity-50 cursor-grab" : "opacity-0"} group-hover:opacity-100`} />
								<div className="flex-1 min-w-0">{renderItem(item)}</div>
								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6"
										onClick={(e) => { e.stopPropagation(); onEdit(item); }}
									>
										<Pencil className="h-3 w-3" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 text-destructive"
										onClick={(e) => { e.stopPropagation(); onDelete(item); }}
									>
										<Trash2 className="h-3 w-3" />
									</Button>
								</div>
							</div>
						))
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
