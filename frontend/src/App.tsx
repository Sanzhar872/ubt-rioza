import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import MapPage from "./pages/MapPage";
import SubjectSelectPage from "./pages/SubjectSelectPage";
import TimelinePage from "./pages/TimelinePage";
import TopicDetailPage from "./pages/TopicDetailPage";
import TopicListPage from "./pages/TopicListPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubjectSelectPage />} />
        <Route path="/:slug" element={<TopicListPage />} />
        <Route path="/:slug/map" element={<MapPage />} />
        <Route path="/:slug/timeline" element={<TimelinePage />} />
        <Route path="/:slug/topics/:topicId" element={<TopicDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
