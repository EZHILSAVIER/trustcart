import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";

import ProductAnalyzer from "./pages/ProductAnalyzer";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import Violations from "./pages/Violations";

// Layout wrapper component
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background font-sans text-primary transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-[100vw]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analyzer" element={<ProductAnalyzer />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="violations" element={<Violations />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
