import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { BrowserRouter, Routes, Route } from "react-router";
import { SubjectsPage } from "./pages/SubjectsPage";
import { UnitsPage } from "./pages/UnitsPage";
import { LearnPage } from "./pages/LearnPage";
import AdminPage from "./pages/AdminPage";
import { setGetToken } from "./lib/api";
import { selectTranslationMockLesson } from "./lib/mockLessons";

export default function App() {
	const { getToken } = useAuth();

	useEffect(() => {
		setGetToken(getToken);
	}, [getToken]);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SubjectsPage />} />
				<Route path="/subjects/:id" element={<UnitsPage />} />
				<Route path="/lessons/:id" element={<LearnPage />} />
				<Route path="/test" element={<LearnPage mockLesson={selectTranslationMockLesson} />} />
				<Route path="/admin/*" element={<AdminPage />} />
			</Routes>
		</BrowserRouter>
	);
}
