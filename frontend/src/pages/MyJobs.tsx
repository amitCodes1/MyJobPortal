import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Clock3,
  IndianRupee,
  MapPin,
  Users,
  Trash2,
    Pencil
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getMyJobs,
  deleteJob
} from "../services/job.service";

import type { Job } from "../types";

const MyJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await getMyJobs();

        setJobs(response.jobs);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load your jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleDelete = async (jobId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(jobId);

      const response = await deleteJob(jobId);

      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job._id !== jobId
        )
      );

      toast.success(
        response.message ||
          "Job deleted successfully"
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete job"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-9 w-56 rounded-lg bg-slate-800" />

            <div className="mt-3 h-5 w-80 rounded bg-slate-800" />

            <div className="mt-10 grid gap-6">
              {Array.from({ length: 3 }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-60 rounded-3xl bg-slate-900"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <Briefcase size={16} />
            Recruiter Dashboard
          </div>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            My Jobs
          </h1>

          <p className="mt-2 text-slate-400">
            Manage the jobs you have posted.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900 px-6 py-16 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
              <Briefcase
                size={30}
                className="text-blue-400"
              />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              No Jobs Posted
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-400">
              You haven't posted any jobs yet.
              Create your first job and start
              finding candidates.
            </p>

            <Link
              to="/create-job"
              className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Create Job
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {jobs.map((job) => (
              <article
                key={job._id}
                className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 sm:p-8"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
                        <Briefcase
                          size={25}
                          className="text-blue-400"
                        />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold sm:text-2xl">
                          {job.title}
                        </h2>

                        <p className="mt-1 text-blue-400">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <MapPin size={16} />
                        {job.location}
                      </span>

                      <span className="flex items-center gap-2">
                        <IndianRupee size={16} />
                        {job.salary.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 size={16} />

                        <span className="capitalize">
                          {job.jobType}
                        </span>
                      </span>

                      <span className="flex items-center gap-2">
                        <Building2 size={16} />
                        {job.experience}
                      </span>
                    </div>
                  </div>

                  <span className="w-fit rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-400">
                    Active
                  </span>
                </div>

                <div className="mt-6 border-t border-slate-800 pt-6">
                  <p className="line-clamp-2 text-sm leading-7 text-slate-400">
                    {job.description}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-6 sm:flex-row">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    View Job
                  </Link>

                  <Link
  to={`/edit-job/${job._id}`}
  className="flex items-center justify-center gap-2 rounded-xl border border-blue-500/20 px-5 py-3 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/10"
>
  <Pencil size={17} />
  Edit
</Link>

                  <Link
                    to={`/jobs/${job._id}/applicants`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-500"
                  >
                    <Users size={17} />
                    Applicants
                  </Link>

                  <button
                    type="button"
                    disabled={
                      deletingId === job._id
                    }
                    onClick={() =>
                      handleDelete(job._id)
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 size={17} />

                    {deletingId === job._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;