import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import AdminLogin from "./pages/AdminLogin";
import AdminWorkspaces from "./pages/AdminWorkspaces";
import AdminWorkspaceDetail from "./pages/AdminWorkspaceDetail";
import AdminProfile from "./pages/AdminProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/workspaces" replace />} />
          <Route path="workspaces" element={<AdminWorkspaces />} />
          <Route path="workspaces/:id" element={<AdminWorkspaceDetail />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="*" element={<div style={{ padding: 24, color: "#f2f3f7" }}>Not found</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
