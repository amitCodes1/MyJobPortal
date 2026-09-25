import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Applicants from "./pages/Applicants";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import MyJobs from "./pages/MyJobs";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";
import CreateJob from "./pages/CreateJob";
import NotFound from "./pages/NotFound";
import EditJob from "./pages/EditJob";
import useAuth from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import JobseekerDashboard from "./pages/JobseekerDashboard";

const App = () => {
  useAuth();

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route
              path="/my-applications"
              element={<MyApplications />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["jobseeker"]} />
            }
          >
            <Route
              path="/jobseeker-dashboard"
              element={<JobseekerDashboard />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["recruiter"]} />
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/my-jobs"
              element={<MyJobs />}
            />
            <Route
              path="/jobs/:id/applicants"
              element={<Applicants />}
            />
            <Route
              path="/create-job"
              element={<CreateJob />}
            />
            <Route
              path="/edit-job/:id"
              element={<EditJob />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;