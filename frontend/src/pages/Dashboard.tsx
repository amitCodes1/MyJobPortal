import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  Users,
  XCircle,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getMyJobs } from "../services/job.service";
import { getJobApplications } from "../services/application.service";

import type { Job } from "../types";
import type { Application } from "../services/application.service";

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const jobsResponse = await getMyJobs();

        setJobs(jobsResponse.jobs);

        const applicationResponses =
          await Promise.all(
            jobsResponse.jobs.map((job) =>
              getJobApplications(job._id)
            )
          );

        const allApplications =
          applicationResponses.flatMap(
            (response) => response.applications
          );

        setApplications(allApplications);
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

  const appliedCount = applications.filter(
    (application) =>
      application.status === "applied"
  ).length;

  const shortlistedCount =
    applications.filter(
      (application) =>
        application.status === "shortlisted"
    ).length;

  const selectedCount = applications.filter(
    (application) =>
      application.status === "selected"
  ).length;

  const rejectedCount = applications.filter(
    (application) =>
      application.status === "rejected"
  ).length;

  const stats = [
    {
      title: "Total Jobs",
      value: jobs.length,
      icon: Briefcase,
      style:
        "border-blue-500/20 bg-blue-500/10 text-blue-400"
    },
    {
      title: "Total Applicants",
      value: applications.length,
      icon: Users,
      style:
        "border-purple-500/20 bg-purple-500/10 text-purple-400"
    },
    {
      title: "Applied",
      value: appliedCount,
      icon: Clock3,
      style:
        "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
    },
    {
      title: "Shortlisted",
      value: shortlistedCount,
      icon: UserCheck,
      style:
        "border-blue-500/20 bg-blue-500/10 text-blue-400"
    },
    {
      title: "Selected",
      value: selectedCount,
      icon: CheckCircle2,
      style:
        "border-green-500/20 bg-green-500/10 text-green-400"
    },
    {
      title: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      style:
        "border-red-500/20 bg-red-500/10 text-red-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-64 rounded-lg bg-slate-800" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 rounded-3xl bg-slate-900"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <Briefcase size={16} />
            Recruiter Dashboard
          </div>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your jobs and track candidates.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/30"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.style}`}
                  >
                    <Icon size={22} />
                  </div>

                  <span className="text-3xl font-extrabold text-white">
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Your Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Manage your current job postings.
              </p>
            </div>

            <Link
              to="/create-job"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Create Job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-700 px-6 py-12 text-center">
              <Briefcase
                size={32}
                className="mx-auto text-slate-600"
              />

              <h3 className="mt-4 font-semibold">
                No jobs posted yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Create your first job posting.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {jobs.slice(0, 5).map((job) => {
                const jobApplications =
                  applications.filter(
                    (application) =>
                      application.job._id === job._id
                  );

                return (
                  <div
                    key={job._id}
                    className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition hover:border-blue-500/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-bold">
                        {job.title}
                      </h3>

                      <p className="mt-1 text-sm text-blue-400">
                        {job.company}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        {job.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-5 sm:justify-end">
                      <div className="text-center">
                        <p className="text-xl font-bold">
                          {jobApplications.length}
                        </p>

                        <p className="text-xs text-slate-500">
                          Applicants
                        </p>
                      </div>

                      <Link
                        to={`/jobs/${job._id}/applicants`}
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

          {jobs.length > 5 && (
            <div className="mt-6 text-center">
              <Link
                to="/my-jobs"
                className="text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View all jobs →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;