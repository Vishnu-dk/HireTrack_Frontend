import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TopNav from "./components/layout/TopNav";
import JobsPage from "./pages/JobsPage";
import CandidatesPage from "./pages/CandidatesPage";
import MyInterviewsPage from "./pages/MyInterviewsPage";
import InterviewsPage from "./pages/InterviewsPage";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./routes/ProtectedRoute";

function AppLayout() {
  const token = useSelector((state) => state.auth.token);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="neutral.50">
      <TopNav />
      <Box as="main" flex="1" w="full">
        <Outlet />
      </Box>
    </Box>
  );
}

function Placeholder({ title }) {
  return (
    <Box p={8} textAlign="center">
      <h1 style={{ fontSize: "24px", color: "#0F172A" }}>{title}</h1>
      <p style={{ color: "#64748B", marginTop: "8px" }}>
        Coming next in the module build.
      </p>
    </Box>
  );
}

// App.jsx
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Default protected route: Any logged-in user can pass */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />


            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/users" element={<UserPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["RECRUITER", "ADMIN"]} />}>
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/candidates" element={<CandidatesPage />} />
              <Route path="/interviews" element={<InterviewsPage />} />
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={["INTERVIEWER"]} />}>
            <Route path="/interviews/my" element={<MyInterviewsPage />} />
            </Route>

          </Route>
        </Route>

        <Route path="/unauthorized" element={<Placeholder title="Access Denied" />} />
      </Routes>
    </BrowserRouter>
  );
}
