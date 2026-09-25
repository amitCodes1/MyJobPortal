import { useEffect, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Search,
  Sparkles,
  Target,
  TrendingUp
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getAllJobs } from "../services/job.service";
import { getMyApplications } from "../services/application.service";
import { getSavedJobs } from "../services/savedJob.service";
import { useAppSelector } from "../store/hooks";

const JobseekerHome = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [jobCount, setJobCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [jobs, applications, savedJobs] =
          await Promise.all([
            getAllJobs(),
            getMyApplications(),
            getSavedJobs()
          ]);

        setJobCount(jobs.count);
        setApplicationCount(applications.count);
        setSavedCount(savedJobs.count);

        setSelectedCount(
          applications.applications.filter(
            (application) =>
              application.status === "selected"
          ).length
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                <Sparkles size={16} />
                Your career journey starts here
              </div>

              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                Welcome back,
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  {user?.name}
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                Discover opportunities, track your applications,
                and move one step closer to your dream career.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => navigate("/jobs")}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
                >
                  <Search size={19} />
                  Find Jobs
                </button>

                <button
                  onClick={() =>
                    navigate("/my-applications")
                  }
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  <BriefcaseBusiness size={19} />
                  My Applications
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
                <div className="rounded-3xl border border-blue-400/10 bg-slate-900/80 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        Career Progress
                      </p>

                      <h2 className="mt-2 text-3xl font-bold">
                        Keep Going
                      </h2>
                    </div>

                    <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
                      <Target size={28} />
                    </div>
                  </div>

                  <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      Profile activity
                    </span>

                    <span className="font-semibold text-blue-400">
                      Active
                    </span>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <TrendingUp
                        size={20}
                        className="text-green-400"
                      />

                      <p className="mt-3 text-2xl font-bold">
                        {applicationCount}
                      </p>

                      <p className="text-sm text-slate-500">
                        Applications
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                      <CheckCircle2
                        size={20}
                        className="text-blue-400"
                      />

                      <p className="mt-3 text-2xl font-bold">
                        {selectedCount}
                      </p>

                      <p className="text-sm text-slate-500">
                        Selected
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl backdrop-blur-xl sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-500/10 p-2 text-purple-400">
                    <Sparkles size={18} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Available Jobs
                    </p>

                    <p className="font-bold">
                      {loading ? "..." : jobCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Your Activity
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Career Dashboard
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-blue-400/30">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
                <BriefcaseBusiness size={23} />
              </div>

              <span className="text-xs text-slate-500">
                Jobs
              </span>
            </div>

            <p className="mt-6 text-3xl font-black">
              {loading ? "..." : jobCount}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Available opportunities
            </p>
          </div>

          <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-purple-400/30">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-400">
                <Clock3 size={23} />
              </div>

              <span className="text-xs text-slate-500">
                Applied
              </span>
            </div>

            <p className="mt-6 text-3xl font-black">
              {loading ? "..." : applicationCount}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Applications submitted
            </p>
          </div>

          <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-yellow-500/10 p-3 text-yellow-400">
                <Bookmark size={23} />
              </div>

              <span className="text-xs text-slate-500">
                Saved
              </span>
            </div>

            <p className="mt-6 text-3xl font-black">
              {loading ? "..." : savedCount}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Saved opportunities
            </p>
          </div>

          <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-green-400/30">
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
                <CheckCircle2 size={23} />
              </div>

              <span className="text-xs text-slate-500">
                Selected
              </span>
            </div>

            <p className="mt-6 text-3xl font-black">
              {loading ? "..." : selectedCount}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Successful applications
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/10 via-white/5 to-purple-600/10 p-8 text-center backdrop-blur-xl sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <Search size={30} />
          </div>

          <h2 className="mt-6 text-3xl font-black sm:text-4xl">
            Ready for your next opportunity?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Explore the latest jobs and find an opportunity
            that matches your skills and career goals.
          </p>

          <button
            onClick={() => navigate("/jobs")}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 font-semibold shadow-xl shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
          >
            <Search size={19} />
            Explore Jobs
          </button>
        </div>
      </section>
    </div>
  );
};

export default JobseekerHome;