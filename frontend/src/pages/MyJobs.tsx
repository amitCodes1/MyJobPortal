import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Edit3,
  MapPin,
  Power,
  Trash2,
  Users,
  XCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  deleteJob,
  getMyJobs,
  toggleJobStatus
} from "../services/job.service";
import type { Job } from "../types";

const MyJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await getMyJobs();

      setJobs(response.jobs || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load your jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (
    job: Job
  ) => {
    try {
      setActionLoading(job._id);

      const response = await toggleJobStatus(
        job._id
      );

      setJobs((prevJobs) =>
        prevJobs.map((item) =>
          item._id === job._id
            ? {
                ...item,
                status: response.job.status
              }
            : item
        )
      );

      toast.success(response.message);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update job status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (
    jobId: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(jobId);

      const response = await deleteJob(jobId);

      setJobs((prevJobs) =>
        prevJobs.filter(
          (job) => job._id !== jobId
        )
      );

      toast.success(response.message);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete job"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="mt-5 text-sm text-slate-400">
              Loading your jobs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
              <BriefcaseBusiness size={16} />
              Recruiter Workspace
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Jobs
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage your job listings, update their
              status, edit details, and review applicants.
            </p>
          </div>

          <Link
            to="/create-job"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
          >
            <BriefcaseBusiness size={18} />
            Post New Job
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Total Jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {jobs.length}
                </p>
              </div>

              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <BriefcaseBusiness size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Active Jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {
                    jobs.filter(
                      (job) =>
                        job.status === "active"
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Closed Jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {
                    jobs.filter(
                      (job) =>
                        job.status === "closed"
                    ).length
                  }
                </p>
              </div>

              <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
                <XCircle size={22} />
              </div>
            </div>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-16 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <BriefcaseBusiness size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              No jobs posted yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Create your first job listing and
              start receiving applications from
              job seekers.
            </p>

            <Link
              to="/create-job"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
            >
              <BriefcaseBusiness size={18} />
              Create Job
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {jobs.map((job) => {
              const isClosed =
                job.status === "closed";

              const isActionLoading =
                actionLoading === job._id;

              return (
                <article
                  key={job._id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-950/30 sm:p-6"
                >
                  <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl transition duration-500 group-hover:bg-blue-500/20" />

                  <div className="relative">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                          {job.title}
                        </h2>

                        <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
                          <Building2
                            size={16}
                            className="shrink-0 text-blue-400"
                          />

                          <span className="truncate">
                            {job.company}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          isClosed
                            ? "bg-red-500/10 text-red-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isClosed
                              ? "bg-red-400"
                              : "bg-emerald-400"
                          }`}
                        />

                        {isClosed
                          ? "Closed"
                          : "Active"}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5 text-sm text-slate-300">
                        <MapPin
                          size={16}
                          className="text-blue-400"
                        />
                        <span className="truncate">
                          {job.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5 text-sm text-slate-300">
                        <BriefcaseBusiness
                          size={16}
                          className="text-purple-400"
                        />
                        <span>
                          {job.jobType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5 text-sm text-slate-300">
                        <CalendarDays
                          size={16}
                          className="text-amber-400"
                        />

                        <span>
                          {new Date(
                            job.createdAt
                          ).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/10 px-3 py-2.5 text-sm text-slate-300">
                        <Users
                          size={16}
                          className="text-pink-400"
                        />

                        <span>
                          {job.experience}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-300">
                        Salary
                      </p>

                      <p className="mt-1 text-lg font-bold text-white">
                        ₹
                        {job.salary.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {job.skills
                        .slice(0, 6)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>

                    <div className="mt-6 grid gap-2 sm:grid-cols-2">
                      <Link
                        to={`/jobs/${job._id}/applicants`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-slate-200 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                      >
                        <Users size={17} />
                        Applicants
                      </Link>

                      <Link
                        to={`/edit-job/${job._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm font-semibold text-blue-300 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-500/20"
                      >
                        <Edit3 size={17} />
                        Edit Job
                      </Link>
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() =>
                          handleToggleStatus(job)
                        }
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${
                          isClosed
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "bg-amber-500 text-slate-950 hover:bg-amber-400"
                        }`}
                      >
                        <Power size={17} />

                        {isActionLoading
                          ? "Updating..."
                          : isClosed
                          ? "Reopen Job"
                          : "Close Job"}
                      </button>

                      <button
                        type="button"
                        disabled={isActionLoading}
                        onClick={() =>
                          handleDelete(job._id)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={17} />
                        Delete Job
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/jobs/${job._id}`
                        )
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition duration-300 hover:bg-white/5 hover:text-white"
                    >
                      View Job Details
                      <ChevronRight
                        size={17}
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;