import { useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";
import {
  Menu,
  X,
  Briefcase,
  User,
  Bookmark,
  FileText,
  LogOut,
  PlusCircle,
  Home,
  Search
} from "lucide-react";
import { toast } from "react-hot-toast";

import { logoutUser } from "../services/auth.service";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const handleLogout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("accessToken");

      dispatch(logout());

      setMobileMenuOpen(false);

      toast.success("Logged out successfully");

      navigate("/login");
    } catch (error: any) {
      localStorage.removeItem("accessToken");

      dispatch(logout());

      setMobileMenuOpen(false);

      toast.error(
        error.response?.data?.message ||
          "Logout failed"
      );

      navigate("/login");
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/85 shadow-sm backdrop-blur-xl">

        <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110">
              <Briefcase size={21} />
            </div>

            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Job<span className="text-blue-600">Portal</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">

            <Link
              to="/"
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive("/")
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <Home size={17} />
              Home
            </Link>

            <Link
              to="/jobs"
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive("/jobs")
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-600"
              }`}
            >
              <Search size={17} />
              Jobs
            </Link>

            {isAuthenticated && (
              <>
                {user?.role === "jobseeker" && (
                  <>
                    <Link
                      to="/saved-jobs"
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        isActive("/saved-jobs")
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <Bookmark size={17} />
                      Saved Jobs
                    </Link>

                    <Link
                      to="/my-applications"
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        isActive("/my-applications")
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <FileText size={17} />
                      Applications
                    </Link>
                  </>
                )}

                {user?.role === "recruiter" && (
                  <>
                    <Link
                      to="/my-jobs"
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        isActive("/my-jobs")
                          ? "bg-blue-50 text-blue-600"
                          : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-600"
                      }`}
                    >
                      <Briefcase size={17} />
                      My Jobs
                    </Link>

                    <Link
                      to="/create-job"
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                        isActive("/create-job")
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:-translate-y-0.5 hover:bg-blue-500"
                      }`}
                    >
                      <PlusCircle size={17} />
                      Create Job
                    </Link>
                  </>
                )}

                <Link
                  to="/profile"
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive("/profile")
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <User size={17} />
                  Profile
                </Link>

                <div className="ml-2 h-7 w-px bg-slate-200" />

                <div className="flex items-center gap-3 pl-2">

                  <div className="hidden text-right xl:block">
                    <p className="max-w-32 truncate text-sm font-bold text-slate-800">
                      {user?.name}
                    </p>

                    <p className="text-xs capitalize text-slate-400">
                      {user?.role}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-100"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>

                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="ml-2 flex items-center gap-2">

                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  Register
                </Link>

              </div>
            )}

          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((previous) => !previous)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-xl lg:hidden">

            <div className="mx-auto max-w-7xl space-y-2">

              <Link
                to="/"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive("/")
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Home size={18} />
                Home
              </Link>

              <Link
                to="/jobs"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                  isActive("/jobs")
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Search size={18} />
                Jobs
              </Link>

              {isAuthenticated && (
                <>
                  {user?.role === "jobseeker" && (
                    <>
                      <Link
                        to="/saved-jobs"
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                          isActive("/saved-jobs")
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Bookmark size={18} />
                        Saved Jobs
                      </Link>

                      <Link
                        to="/my-applications"
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                          isActive("/my-applications")
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <FileText size={18} />
                        Applications
                      </Link>
                    </>
                  )}

                  {user?.role === "recruiter" && (
                    <>
                      <Link
                        to="/my-jobs"
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                          isActive("/my-jobs")
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Briefcase size={18} />
                        My Jobs
                      </Link>

                      <Link
                        to="/create-job"
                        onClick={closeMobileMenu}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                          isActive("/create-job")
                            ? "bg-blue-600 text-white"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        }`}
                      >
                        <PlusCircle size={18} />
                        Create Job
                      </Link>
                    </>
                  )}

                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive("/profile")
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <User size={18} />
                    Profile
                  </Link>

                  <div className="my-3 border-t border-slate-100" />

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-800">
                        {user?.name}
                      </p>

                      <p className="text-xs capitalize text-slate-400">
                        {user?.role}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-100"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>

                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="grid grid-cols-2 gap-2 pt-2">

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Register
                  </Link>

                </div>
              )}

            </div>

          </div>
        )}

      </nav>

      <main>
        <Outlet />
      </main>

    </div>
  );
};

export default MainLayout;