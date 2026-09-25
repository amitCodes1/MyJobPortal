import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Plus,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  XCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getMyJobs } from "../services/job.service";
import {
  getJobApplications
} from "../services/application.service";

import type { Job } from "../types";
import type { Application } from "../services/application.service";

interface JobWithApplicants {
  job: Job;
  applications: Application[];
}

const RecruiterHome = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobApplications, setJobApplications] =
    useState<JobWithApplicants[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadRecruiterData = async () => {
      try {
        setLoading(true);

        const jobsResponse = await getMyJobs();

        const recruiterJobs = jobsResponse.jobs;

        setJobs(recruiterJobs);

        const applicationResults =
          await Promise.all(
            recruiterJobs.map(async (job) => {
              try {
                const response =
                  await getJobApplications(job._id);

                return {
                  job,
                  applications:
                    response.applications
                };
              } catch {
                return {
                  job,
                  applications: []
                };
              }
            })
          );

        setJobApplications(applicationResults);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load recruiter dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecruiterData();
  }, []);

  const allApplications = useMemo(() => {
    return jobApplications.flatMap(
      (item) => item.applications
    );
  }, [jobApplications]);

  const totalApplicants =
    allApplications.length;

  const shortlistedCount =
    allApplications.filter(
      (application) =>
        application.status === "shortlisted"
    ).length;

  const selectedCount =
    allApplications.filter(
      (application) =>
        application.status === "selected"
    ).length;

  const rejectedCount =
    allApplications.filter(
      (application) =>
        application.status === "rejected"
    ).length;

  const appliedCount =
    allApplications.filter(
      (application) =>
        application.status === "applied"
    ).length;

  const filteredJobs = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    if (!value) {
      return jobs;
    }

    return jobs.filter(
      (job) =>
        job.title
          .toLowerCase()
          .includes(value) ||
        job.company
          .toLowerCase()
          .includes(value) ||
        job.location
          .toLowerCase()
          .includes(value)
    );
  }, [jobs, search]);

  const recentApplications = useMemo(() => {
    return [...allApplications]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [allApplications]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-10 w-72 rounded-lg bg-slate-800" />

          <div className="mt-10 h-52 rounded-[2rem] bg-slate-900" />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4
            }).map((_, index) => (
              <div
                key={index}
                className="h-36 rounded-3xl bg-slate-900"
              />
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="h-96 rounded-3xl bg-slate-900" />
            <div className="h-96 rounded-3xl bg-slate-900" />
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">

      <div className="pointer-events-none absolute left-[-12rem] top-[-8rem] h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-12rem] top-32 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
              <TrendingUp size={16} />
              Recruiter Command Center
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
              Build your next great team.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Manage your job listings, discover candidates
              and track your hiring pipeline from one place.
            </p>

          </div>

          <Link
            to="/create-job"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-1 hover:bg-blue-500"
          >
            <Plus size={20} />
            Post New Job
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>

        </div>

        {/* STATS */}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="group rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 transition duration-300 hover:-translate-y-2 hover:bg-blue-500/10">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <BriefcaseBusiness size={23} />
              </div>

              <span className="text-3xl font-black">
                {jobs.length}
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Active Job Posts
            </p>

          </div>

          <div className="group rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6 transition duration-300 hover:-translate-y-2 hover:bg-purple-500/10">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <Users size={23} />
              </div>

              <span className="text-3xl font-black">
                {totalApplicants}
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Total Applicants
            </p>

          </div>

          <div className="group rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-6 transition duration-300 hover:-translate-y-2 hover:bg-yellow-500/10">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">
                <UserCheck size={23} />
              </div>

              <span className="text-3xl font-black">
                {shortlistedCount}
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Shortlisted
            </p>

          </div>

          <div className="group rounded-3xl border border-green-500/20 bg-green-500/5 p-6 transition duration-300 hover:-translate-y-2 hover:bg-green-500/10">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
                <CheckCircle2 size={23} />
              </div>

              <span className="text-3xl font-black">
                {selectedCount}
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-400">
              Selected Candidates
            </p>

          </div>

        </div>

        {/* PIPELINE */}

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold">
                Hiring Pipeline
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current status of your candidate applications.
              </p>
            </div>

            <Link
              to="/my-jobs"
              className="text-sm font-semibold text-blue-400 hover:text-blue-300"
            >
              Manage Jobs →
            </Link>

          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-4">

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Applied
                </span>

                <Clock3
                  size={18}
                  className="text-blue-400"
                />

              </div>

              <p className="mt-4 text-3xl font-black">
                {appliedCount}
              </p>

            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Shortlisted
                </span>

                <UserCheck
                  size={18}
                  className="text-yellow-400"
                />

              </div>

              <p className="mt-4 text-3xl font-black">
                {shortlistedCount}
              </p>

            </div>

            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Selected
                </span>

                <CheckCircle2
                  size={18}
                  className="text-green-400"
                />

              </div>

              <p className="mt-4 text-3xl font-black">
                {selectedCount}
              </p>

            </div>

            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

              <div className="flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Rejected
                </span>

                <XCircle
                  size={18}
                  className="text-red-400"
                />

              </div>

              <p className="mt-4 text-3xl font-black">
                {rejectedCount}
              </p>

            </div>

          </div>

        </section>

        {/* MAIN GRID */}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* JOBS */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-2xl font-bold">
                  Your Job Listings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor your active opportunities.
                </p>
              </div>

              <Link
                to="/my-jobs"
                className="text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                View All →
              </Link>

            </div>

            <div className="relative mt-6">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search your jobs..."
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500"
              />

            </div>

            <div className="mt-6 space-y-4">

              {filteredJobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-10 text-center">

                  <BriefcaseBusiness
                    size={34}
                    className="mx-auto text-slate-700"
                  />

                  <h3 className="mt-4 font-bold">
                    No jobs found
                  </h3>

                  <Link
                    to="/create-job"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold"
                  >
                    <Plus size={16} />
                    Create Job
                  </Link>

                </div>
              ) : (
                filteredJobs.slice(0, 5).map(
                  (job) => {
                    const jobData =
                      jobApplications.find(
                        (item) =>
                          item.job._id === job._id
                      );

                    const applicantCount =
                      jobData?.applications.length ||
                      0;

                    return (
                      <div
                        key={job._id}
                        className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30"
                      >

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-black">
                              {job.company
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <h3 className="font-bold transition group-hover:text-blue-400">
                                {job.title}
                              </h3>

                              <p className="mt-1 text-sm text-slate-500">
                                {job.location}
                              </p>

                            </div>

                          </div>

                          <div className="flex items-center justify-between gap-4 sm:justify-end">

                            <div className="text-center">
                              <p className="text-xl font-black">
                                {applicantCount}
                              </p>

                              <p className="text-xs text-slate-600">
                                Applicants
                              </p>
                            </div>

                            <Link
                              to={`/jobs/${job._id}/applicants`}
                              className="rounded-xl bg-blue-500/10 px-4 py-2.5 text-sm font-bold text-blue-400 transition hover:bg-blue-500/20"
                            >
                              View
                            </Link>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )
              )}

            </div>

          </section>

          {/* RECENT APPLICATIONS */}

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl sm:p-8">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold">
                  Recent Applications
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest candidate activity.
                </p>
              </div>

              <Users
                size={21}
                className="text-blue-400"
              />

            </div>

            <div className="mt-6 space-y-4">

              {recentApplications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">

                  <Users
                    size={30}
                    className="mx-auto text-slate-700"
                  />

                  <p className="mt-3 text-sm text-slate-500">
                    No applications yet.
                  </p>

                </div>
              ) : (
                recentApplications.map(
                  (application) => {

                    const applicant =
                      application.applicant;

                    if (!applicant) {
                      return null;
                    }

                    return (
                      <div
                        key={application._id}
                        className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                      >

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-black">
                            {applicant.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-bold">
                              {applicant.name}
                            </p>

                            <p className="truncate text-xs text-slate-600">
                              {applicant.email}
                            </p>

                          </div>

                        </div>

                        <div className="mt-4 flex items-center justify-between">

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
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
                            {application.status}
                          </span>

                          <span className="text-[10px] text-slate-600">
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short"
                              }
                            )}
                          </span>

                        </div>

                      </div>
                    );
                  }
                )
              )}

            </div>

          </section>

        </div>

        {/* QUICK ACTIONS */}

        <section className="mt-8 grid gap-5 md:grid-cols-3">

          <Link
            to="/create-job"
            className="group rounded-3xl border border-blue-500/20 bg-blue-500/5 p-6 transition duration-300 hover:-translate-y-2 hover:bg-blue-500/10"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Plus size={23} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Post a New Job
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Publish a new opportunity and start receiving
              applications.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-400">
              Create Job
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </span>

          </Link>

          <Link
            to="/my-jobs"
            className="group rounded-3xl border border-purple-500/20 bg-purple-500/5 p-6 transition duration-300 hover:-translate-y-2 hover:bg-purple-500/10"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <BriefcaseBusiness size={23} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Manage Jobs
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Edit your job listings, review applicants and
              manage your hiring pipeline.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-purple-400">
              Manage Jobs
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </span>

          </Link>

          <Link
            to="/profile"
            className="group rounded-3xl border border-green-500/20 bg-green-500/5 p-6 transition duration-300 hover:-translate-y-2 hover:bg-green-500/10"
          >

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
              <Users size={23} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Recruiter Profile
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep your recruiter information updated for
              candidates.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-400">
              View Profile
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </span>

          </Link>

        </section>

      </div>
    </div>
  );
};

export default RecruiterHome;