import { BrowserRouter, Routes, Route } from "react-router";
import { SubjectsPage } from "./pages/SubjectsPage";
import { UnitsPage } from "./pages/UnitsPage";
import { LearnPage } from "./pages/LearnPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SubjectsPage />} />
				<Route path="/subjects/:id" element={<UnitsPage />} />
				<Route path="/lessons/:id" element={<LearnPage />} />
				<Route path="/admin/*" element={<AdminPage />} />
			</Routes>
		</BrowserRouter>
	);
}
