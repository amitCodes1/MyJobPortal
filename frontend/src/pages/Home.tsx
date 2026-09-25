import { useAppSelector } from "../store/hooks";

import PublicHome from "./PublicHome";
import JobseekerHome from "./JobseekerHome";
import RecruiterHome from "./RecruiterHome";

const Home = () => {
  const { user, loading } = useAppSelector(
    (state) => state.auth
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-sm text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <PublicHome />;
  }

  if (user.role === "recruiter") {
    return <RecruiterHome />;
  }

  return <JobseekerHome />;
};

export default Home;