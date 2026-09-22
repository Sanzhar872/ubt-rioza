import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ServerWakeScreen from "./components/ServerWakeScreen";
import MapPage from "./pages/MapPage";
import QuizHubPage from "./pages/QuizHubPage";
import QuizPage from "./pages/QuizPage";
import SubjectSelectPage from "./pages/SubjectSelectPage";
import TopicDetailPage from "./pages/TopicDetailPage";
import TopicListPage from "./pages/TopicListPage";
import VariantAnalysisPage from "./pages/VariantAnalysisPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The quiz bank is a static JSON file, no backend involved — don't make it
            wait behind the (possibly sleeping) free-tier API. */}
        <Route path="/:slug/quiz" element={<QuizHubPage />} />
        <Route path="/:slug/quiz/:topicSlug" element={<QuizPage />} />

        <Route
          path="/*"
          element={
            <ServerWakeScreen>
              <Routes>
                <Route path="/" element={<SubjectSelectPage />} />
                <Route path="/:slug" element={<TopicListPage />} />
                <Route path="/:slug/map" element={<MapPage />} />
                <Route path="/:slug/nuska-taldau" element={<VariantAnalysisPage />} />
                <Route path="/:slug/topics/:topicId" element={<TopicDetailPage />} />
              </Routes>
            </ServerWakeScreen>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
