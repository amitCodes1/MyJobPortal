import { useEffect, useState } from "react";
import {
  Bookmark,
  Briefcase,
  CheckCircle2,
  Clock3,
  User,
  ArrowRight,
  XCircle,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getMyApplications } from "../services/application.service";
import { getSavedJobs } from "../services/savedJob.service";

import type { Application } from "../services/application.service";

const JobseekerDashboard = () => {
  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [applicationsResponse, savedJobsResponse] =
          await Promise.all([
            getMyApplications(),
            getSavedJobs()
          ]);

        setApplications(
          applicationsResponse.applications
        );

        setSavedCount(savedJobsResponse.count);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const selectedCount = applications.filter(
    (application) =>
      application.status === "selected"
  ).length;

  const shortlistedCount = applications.filter(
    (application) =>
      application.status === "shortlisted"
  ).length;

  const stats = [
    {
      title: "Applied Jobs",
      value: applications.length,
      icon: Briefcase,
      style:
        "border-blue-500/20 bg-blue-500/10 text-blue-400"
    },
    {
      title: "Saved Jobs",
      value: savedCount,
      icon: Bookmark,
      style:
        "border-purple-500/20 bg-purple-500/10 text-purple-400"
    },
    {
      title: "Shortlisted",
      value: shortlistedCount,
      icon: Clock3,
      style:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
    },
    {
      title: "Selected",
      value: selectedCount,
      icon: CheckCircle2,
      style:
        "border-green-500/20 bg-green-500/10 text-green-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-72 rounded-lg bg-slate-800" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 rounded-3xl bg-slate-900"
                />
              )
            )}
          </div>

          <div className="mt-10 h-80 rounded-3xl bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <User size={16} />
              Jobseeker Dashboard
            </div>

            <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
              Your Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Track your applications and manage your job search.
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-500"
          >
            Browse Jobs
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-blue-500/10"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.style}`}
                  >
                    <Icon size={22} />
                  </div>

                  <span className="text-3xl font-extrabold">
                    {stat.value}
                  </span>
                </div>

                <p className="mt-5 text-sm font-medium text-slate-400">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Recent Applications
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Track the latest jobs you applied for.
              </p>
            </div>

            <Link
              to="/my-applications"
              className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
            >
              View All →
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-700 px-6 py-12 text-center">
              <Briefcase
                size={36}
                className="mx-auto text-slate-600"
              />

              <h3 className="mt-4 text-lg font-semibold">
                No applications yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Start applying for jobs that match your skills.
              </p>

              <Link
                to="/jobs"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Find Jobs
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {applications
                .slice(0, 5)
                .map((application) => {
                  if (!application.job) {
                    return (
                      <div
                        key={application._id}
                        className="rounded-2xl border border-red-500/20 bg-slate-950/60 p-5"
                      >
                        <div className="flex items-center gap-3">
                          <XCircle
                            size={22}
                            className="text-red-400"
                          />

                          <div>
                            <h3 className="font-bold">
                              Job No Longer Available
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              This job has been removed by the recruiter.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={application._id}
                      className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-blue-500/30 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <h3 className="font-bold">
                          {application.job.title}
                        </h3>

                        <p className="mt-1 text-sm text-blue-400">
                          {application.job.company}
                        </p>

                        <p className="mt-2 text-sm text-slate-500">
                          {application.job.location}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            application.status ===
                            "selected"
                              ? "bg-green-500/10 text-green-400"
                              : application.status ===
                                  "shortlisted"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : application.status ===
                                    "rejected"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {application.status ===
                            "selected" && (
                            <CheckCircle2 size={14} />
                          )}

                          {application.status ===
                            "shortlisted" && (
                            <UserCheck size={14} />
                          )}

                          {application.status ===
                            "rejected" && (
                            <XCircle size={14} />
                          )}

                          {application.status ===
                            "applied" && (
                            <Clock3 size={14} />
                          )}

                          {application.status}
                        </span>

                        <Link
                          to={`/jobs/${application.job._id}`}
                          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Link
            to="/profile"
            className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500/30"
          >
            <User className="text-blue-400" />

            <h3 className="mt-5 text-xl font-bold">
              Complete Your Profile
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Keep your profile and skills updated for recruiters.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
              Go to Profile
              <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/saved-jobs"
            className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-purple-500/30"
          >
            <Bookmark className="text-purple-400" />

            <h3 className="mt-5 text-xl font-bold">
              Saved Jobs
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Revisit the jobs you saved for later.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-400">
              View Saved Jobs
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobseekerDashboard;