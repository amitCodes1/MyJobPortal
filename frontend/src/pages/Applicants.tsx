import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Mail,
  MapPin,
  Search,
  User,
  UserCheck,
  Users,
  X,
  XCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getJobApplications,
  updateApplicationStatus
} from "../services/application.service";

import type { Application } from "../services/application.service";

type Status =
  | "applied"
  | "shortlisted"
  | "rejected"
  | "selected";

const Applicants = () => {
  const { id } = useParams();

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | Status>("all");

  const loadApplications = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const response =
        await getJobApplications(id);

      setApplications(response.applications);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [id]);

  const handleStatusChange = async (
    applicationId: string,
    status: Status
  ) => {
    try {
      setUpdatingId(applicationId);

      const response =
        await updateApplicationStatus(
          applicationId,
          status
        );

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? {
                ...application,
                status:
                  response.application.status
              }
            : application
        )
      );

      toast.success(
        "Application status updated"
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = useMemo(() => {
    const value = search
      .toLowerCase()
      .trim();

    return applications.filter(
      (application) => {
        const applicant =
          application.applicant;

        if (!applicant) {
          return false;
        }

        const matchesSearch =
          !value ||
          applicant.name
            .toLowerCase()
            .includes(value) ||
          applicant.email
            .toLowerCase()
            .includes(value) ||
          applicant.phone
            ?.toLowerCase()
            .includes(value) ||
          applicant.skills?.some((skill) =>
            skill.toLowerCase().includes(value)
          );

        const matchesStatus =
          statusFilter === "all" ||
          application.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    applications,
    search,
    statusFilter
  ]);

  const appliedCount = applications.filter(
    (item) => item.status === "applied"
  ).length;

  const shortlistedCount =
    applications.filter(
      (item) =>
        item.status === "shortlisted"
    ).length;

  const selectedCount = applications.filter(
    (item) => item.status === "selected"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "rejected"
  ).length;

  const getStatusStyle = (
    status: Status
  ) => {
    if (status === "selected") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (status === "shortlisted") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
    }

    if (status === "rejected") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-blue-500/20 bg-blue-500/10 text-blue-400";
  };

  const getStatusIcon = (
    status: Status
  ) => {
    if (status === "selected") {
      return <CheckCircle2 size={15} />;
    }

    if (status === "shortlisted") {
      return <UserCheck size={15} />;
    }

    if (status === "rejected") {
      return <XCircle size={15} />;
    }

    return <Clock3 size={15} />;
  };

  const getResumeUrl = (
    resume?: string
  ) => {
    if (!resume) return "";

    const baseUrl =
      import.meta.env.VITE_API_URL.replace(
        "/api",
        ""
      );

    return `${baseUrl}${resume}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="h-6 w-32 rounded bg-slate-800" />

          <div className="mt-8 h-40 rounded-[2rem] bg-slate-900" />

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({
              length: 4
            }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-3xl bg-slate-900"
              />
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {Array.from({
              length: 4
            }).map((_, index) => (
              <div
                key={index}
                className="h-80 rounded-3xl bg-slate-900"
              />
            ))}
          </div>

        </div>
      </div>
    );
  }

  const jobTitle =
    applications[0]?.job?.title ||
    "Job Applicants";

  const company =
    applications[0]?.job?.company ||
    "";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">

      <div className="pointer-events-none absolute left-[-10rem] top-20 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-10rem] top-80 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">

        <Link
          to="/my-jobs"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to My Jobs
        </Link>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">

          <div className="absolute right-[-5rem] top-[-5rem] h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-5">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-2xl font-black shadow-xl shadow-blue-500/20">
                {company
                  ? company
                      .charAt(0)
                      .toUpperCase()
                  : "J"}
              </div>

              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                  <Users size={13} />
                  Applicant Management
                </div>

                <h1 className="text-2xl font-black sm:text-4xl">
                  {jobTitle}
                </h1>

                {company && (
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                    <Briefcase size={15} />
                    {company}
                  </p>
                )}
              </div>

            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 px-6 py-4">
              <p className="text-xs text-slate-500">
                Total Applicants
              </p>

              <p className="mt-1 text-3xl font-black text-blue-400">
                {applications.length}
              </p>
            </div>

          </div>

        </section>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="group rounded-3xl border border-blue-500/20 bg-blue-500/5 p-5 transition duration-300 hover:-translate-y-2 hover:bg-blue-500/10">
            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Clock3 size={21} />
              </div>

              <span className="text-3xl font-black">
                {appliedCount}
              </span>

            </div>

            <p className="mt-4 text-sm text-slate-400">
              Applied
            </p>
          </div>

          <div className="group rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5 transition duration-300 hover:-translate-y-2 hover:bg-yellow-500/10">
            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                <UserCheck size={21} />
              </div>

              <span className="text-3xl font-black">
                {shortlistedCount}
              </span>

            </div>

            <p className="mt-4 text-sm text-slate-400">
              Shortlisted
            </p>
          </div>

          <div className="group rounded-3xl border border-green-500/20 bg-green-500/5 p-5 transition duration-300 hover:-translate-y-2 hover:bg-green-500/10">
            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                <CheckCircle2 size={21} />
              </div>

              <span className="text-3xl font-black">
                {selectedCount}
              </span>

            </div>

            <p className="mt-4 text-sm text-slate-400">
              Selected
            </p>
          </div>

          <div className="group rounded-3xl border border-red-500/20 bg-red-500/5 p-5 transition duration-300 hover:-translate-y-2 hover:bg-red-500/10">
            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <XCircle size={21} />
              </div>

              <span className="text-3xl font-black">
                {rejectedCount}
              </span>

            </div>

            <p className="mt-4 text-sm text-slate-400">
              Rejected
            </p>
          </div>

        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-xl backdrop-blur-xl sm:p-5">

          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">

            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search candidate by name, email or skill..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | Status
                )
              }
              className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3.5 text-sm font-medium capitalize text-slate-300 outline-none transition focus:border-blue-500"
            >
              <option value="all">
                All Applicants
              </option>
              <option value="applied">
                Applied
              </option>
              <option value="shortlisted">
                Shortlisted
              </option>
              <option value="selected">
                Selected
              </option>
              <option value="rejected">
                Rejected
              </option>
            </select>

          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing{" "}
              <span className="font-semibold text-slate-300">
                {filteredApplications.length}
              </span>{" "}
              applicants
            </span>

            {(search || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                Clear Filters
              </button>
            )}
          </div>

        </div>

        {filteredApplications.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-700 bg-white/[0.03] px-6 py-20 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-slate-600">
              <Users size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No Applicants Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No applicants match your current search
              or filter.
            </p>

          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            {filteredApplications.map(
              (application) => {
                const applicant =
                  application.applicant;

                if (!applicant) {
                  return null;
                }

                const resumeUrl =
                  getResumeUrl(
                    applicant.resume
                  );

                return (
                  <article
                    key={application._id}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 sm:p-7"
                  >

                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/5 transition duration-500 group-hover:scale-150" />

                    <div className="relative">

                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex items-center gap-4">

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-black shadow-lg shadow-blue-500/10">
                            {applicant.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <h2 className="text-xl font-bold">
                              {applicant.name}
                            </h2>

                            <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                              <Mail size={14} />
                              {applicant.email}
                            </p>
                          </div>

                        </div>

                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getStatusStyle(
                            application.status
                          )}`}
                        >
                          {getStatusIcon(
                            application.status
                          )}

                          {application.status}
                        </span>

                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">

                        {applicant.phone && (
                          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <User size={14} />
                              Phone
                            </div>

                            <p className="mt-2 text-sm font-semibold text-slate-300">
                              {applicant.phone}
                            </p>
                          </div>
                        )}

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock3 size={14} />
                            Applied
                          </div>

                          <p className="mt-2 text-sm font-semibold text-slate-300">
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                              }
                            )}
                          </p>
                        </div>

                      </div>

                      {applicant.skills &&
                        applicant.skills.length >
                          0 && (
                          <div className="mt-6">

                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Skills
                            </p>

                            <div className="flex flex-wrap gap-2">

                              {applicant.skills.map(
                                (
                                  skill,
                                  index
                                ) => (
                                  <span
                                    key={`${skill}-${index}`}
                                    className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-blue-500/30 hover:text-blue-300"
                                  >
                                    {skill}
                                  </span>
                                )
                              )}

                            </div>

                          </div>
                        )}

                      {application.coverLetter && (
                        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            <FileText size={14} />
                            Cover Letter
                          </div>

                          <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-400">
                            {application.coverLetter}
                          </p>

                        </div>
                      )}

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                        {resumeUrl ? (
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm font-bold text-blue-300 transition hover:-translate-y-1 hover:bg-blue-500/20"
                          >
                            <FileText size={17} />
                            View Resume
                          </a>
                        ) : (
                          <div className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-600">
                            <FileText size={17} />
                            No Resume
                          </div>
                        )}

                        {resumeUrl && (
                          <a
                            href={resumeUrl}
                            download
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
                          >
                            <Download size={17} />
                            Download
                          </a>
                        )}

                      </div>

                      <div className="mt-6 border-t border-slate-800 pt-5">

                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Update Application
                        </p>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                application._id,
                                "applied"
                              )
                            }
                            className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-3 py-2.5 text-xs font-bold text-blue-400 transition hover:bg-blue-500/15 disabled:opacity-50"
                          >
                            Applied
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                application._id,
                                "shortlisted"
                              )
                            }
                            className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-3 py-2.5 text-xs font-bold text-yellow-400 transition hover:bg-yellow-500/15 disabled:opacity-50"
                          >
                            Shortlist
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                application._id,
                                "selected"
                              )
                            }
                            className="rounded-xl border border-green-500/20 bg-green-500/5 px-3 py-2.5 text-xs font-bold text-green-400 transition hover:bg-green-500/15 disabled:opacity-50"
                          >
                            Select
                          </button>

                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              application._id
                            }
                            onClick={() =>
                              handleStatusChange(
                                application._id,
                                "rejected"
                              )
                            }
                            className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/15 disabled:opacity-50"
                          >
                            Reject
                          </button>

                        </div>

                        {updatingId ===
                          application._id && (
                          <p className="mt-3 text-center text-xs text-slate-500">
                            Updating application...
                          </p>
                        )}

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Applicants;