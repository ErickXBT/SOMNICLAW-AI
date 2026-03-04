import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./app/App.tsx";
import AssistantPage from "./app/pages/AssistantPage.tsx";
import LaunchpadPage from "./app/pages/LaunchpadPage.tsx";
import GenerativeAiPage from "./app/pages/GenerativeAiPage.tsx";
import WhitelistPage from "./app/pages/WhitelistPage.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="/launchpad" element={<LaunchpadPage />} />
      <Route path="/generative-ai" element={<GenerativeAiPage />} />
      <Route path="/whitelist" element={<WhitelistPage />} />
    </Routes>
  </BrowserRouter>
);
