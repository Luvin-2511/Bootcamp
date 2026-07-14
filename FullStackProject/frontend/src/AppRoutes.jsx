import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Skeleton from "./components/Skeleton";
import ThemeToggle from "./components/ThemeToggle";

// Lazy loading feature pages
const DashboardPage = React.lazy(() => import("./features/dashboard").then(m => ({ default: m.DashboardPage })));
const GeneratorPage = React.lazy(() => import("./features/generator").then(m => ({ default: m.GeneratorPage })));
const ExportPage    = React.lazy(() => import("./features/export").then(m => ({ default: m.ExportPage })));
const HistoryPage   = React.lazy(() => import("./features/history").then(m => ({ default: m.HistoryPage })));

const AppRoutes = () => (
  <BrowserRouter>
    <div className="layout">
      <ThemeToggle />
      <Sidebar />
      <main className="main">
        <Suspense fallback={
          <div>
            <Skeleton type="title" />
            <div className="grid-3"><Skeleton type="card" count={3} /></div>
          </div>
        }>
          <Routes>
            <Route path="/"          element={<DashboardPage />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/export"    element={<ExportPage />} />
            <Route path="/history"   element={<HistoryPage />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  </BrowserRouter>
);

export default AppRoutes;
