
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  IndianRupee,
  Mail,
  MapPin,
  Send,
  Sparkles,
  User,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getJobById } from "../services/job.service";

import { applyForJob } from "../services/application.service";

import {
  getSavedJobs,
  removeSavedJob,
  saveJob
} from "../services/savedJob.service";

import { useAppSelector } from "../store/hooks";

import type { Job } from "../types";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAppSelector(
    (state) => state.auth
  );

  const [job, setJob] = useState<Job | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] =
    useState(false);

  const [coverLetter, setCoverLetter] =
    useState("");

  useEffect(() => {
    const loadJob = async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);

        const response = await getJobById(id);

        setJob(response.job);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load job"
        );
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  useEffect(() => {
    const checkSavedJob = async () => {
      if (
        !id ||
        !user ||
        user.role !== "jobseeker"
      ) {
        return;
      }

      try {
        const response = await getSavedJobs();

        const exists = response.savedJobs.some(
          (savedJob: any) =>
            savedJob.job &&
            savedJob.job._id === id
        );

        setIsSaved(exists);
      } catch {
        setIsSaved(false);
      }
    };

    checkSavedJob();
  }, [id, user]);

  const handleSaveJob = async () => {
    if (!job) {
      return;
    }

    if (!user) {
      toast.error("Please login to save jobs");
      navigate("/login");
      return;
    }

    if (user.role !== "jobseeker") {
      toast.error(
        "Only jobseekers can save jobs"
      );
      return;
    }

    try {
      setSaving(true);

      if (isSaved) {
        await removeSavedJob(job._id);

        setIsSaved(false);

        toast.success(
          "Job removed from saved jobs"
        );
      } else {
        await saveJob(job._id);

        setIsSaved(true);

        toast.success(
          "Job saved successfully"
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!job) {
      return;
    }

    if (job.status === "closed") {
      toast.error(
        "This job is no longer accepting applications"
      );
      setShowApplyModal(false);
      return;
    }

    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    if (user.role !== "jobseeker") {
      toast.error(
        "Only jobseekers can apply for jobs"
      );
      return;
    }

    try {
      setApplying(true);

      await applyForJob({
        jobId: job._id,
        coverLetter
      });

      toast.success(
        "Application submitted successfully"
      );

      setShowApplyModal(false);
      setCoverLetter("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit application"
      );
    } finally {
      setApplying(false);
    }
  };

  const openApplyModal = () => {
    if (!job) {
      return;
    }

    if (job.status === "closed") {
      toast.error(
        "This job is no longer accepting applications"
      );
      return;
    }

    if (!user) {
      toast.error("Please login to apply");
      navigate("/login");
      return;
    }

    if (user.role !== "jobseeker") {
      toast.error(
        "Only jobseekers can apply for jobs"
      );
      return;
    }

    setShowApplyModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-6 w-32 rounded bg-slate-800" />

          <div className="mt-8 h-72 rounded-[2rem] bg-slate-900" />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-3xl bg-slate-900 lg:col-span-2" />

            <div className="h-80 rounded-3xl bg-slate-900" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <Briefcase
            size={50}
            className="mx-auto text-slate-600"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Job Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            This job may have been removed.
          </p>

          <Link
            to="/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
          >
            <ArrowLeft size={17} />
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  const recruiterName =
    typeof job.recruiter === "object"
      ? job.recruiter.name
      : "Recruiter";

  const recruiterEmail =
    typeof job.recruiter === "object"
      ? job.recruiter.email
      : "";

  const isClosed = job.status === "closed";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-12rem] top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="pointer-events-none absolute right-[-10rem] top-72 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Jobs
        </button>

        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="absolute right-[-5rem] top-[-5rem] h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="absolute bottom-[-6rem] left-1/3 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="flex h-24 w-24 rotate-[-4deg] items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-4xl font-black shadow-2xl shadow-blue-500/20 transition duration-500 hover:rotate-3 hover:scale-105">
                  {job.company
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div
                  className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-slate-950 ${
                    isClosed
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {isClosed ? (
                    <X size={15} />
                  ) : (
                    <CheckCircle2
                      size={15}
                      className="text-white"
                    />
                  )}
                </div>
              </div>

              <div>
                <div
                  className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    isClosed
                      ? "border-red-500/20 bg-red-500/10 text-red-300"
                      : "border-blue-500/20 bg-blue-500/10 text-blue-300"
                  }`}
                >
                  {isClosed ? (
                    <>
                      <X size={13} />
                      Applications Closed
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      Featured Opportunity
                    </>
                  )}
                </div>

                <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                  {job.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                  <span className="flex items-center gap-2">
                    <Building2
                      size={16}
                      className="text-blue-400"
                    />
                    {job.company}
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin
                      size={16}
                      className="text-purple-400"
                    />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {user?.role === "jobseeker" && (
                <button
                  type="button"
                  onClick={handleSaveJob}
                  disabled={saving}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-3.5 text-sm font-bold transition-all duration-300 ${
                    isSaved
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-300"
                      : "border-slate-700 bg-slate-900 text-slate-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
                  }`}
                >
                  <Bookmark
                    size={18}
                    fill={
                      isSaved
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {saving
                    ? "Saving..."
                    : isSaved
                    ? "Saved"
                    : "Save Job"}
                </button>
              )}

              {user?.role !== "recruiter" &&
                (isClosed ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-slate-800 px-7 py-3.5 text-sm font-bold text-slate-500"
                  >
                    <X size={18} />
                    Applications Closed
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openApplyModal}
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:from-blue-500 hover:to-indigo-500"
                  >
                    Apply Now

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                ))}
            </div>
          </div>

          <div className="relative mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-green-500/10 p-2.5 text-green-400">
                  <IndianRupee size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Salary
                  </p>

                  <p className="mt-1 font-bold">
                    ₹
                    {job.salary.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
                  <Briefcase size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Job Type
                  </p>

                  <p className="mt-1 font-bold capitalize">
                    {job.jobType.replace(
                      "-",
                      " "
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400">
                  <Clock3 size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Experience
                  </p>

                  <p className="mt-1 font-bold">
                    {job.experience}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="mt-1 truncate font-bold">
                    {job.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <main className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-400 to-purple-500" />

                <h2 className="text-2xl font-bold">
                  About This Role
                </h2>
              </div>

              <p className="mt-6 whitespace-pre-line text-[15px] leading-8 text-slate-400">
                {job.description}
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl backdrop-blur-xl sm:p-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-purple-400 to-pink-500" />

                <h2 className="text-2xl font-bold">
                  Required Skills
                </h2>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {job.skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-2xl border border-blue-500/10 bg-blue-500/5 px-4 py-2.5 text-sm font-semibold text-blue-300 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:bg-blue-500/10"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-400">
                    {isClosed
                      ? "Applications are closed"
                      : "Ready for your next move?"}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    {isClosed
                      ? "This opportunity is no longer accepting applications."
                      : "Take the next step."}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {isClosed
                      ? "You can explore other available jobs."
                      : "Submit your application and let your skills speak for you."}
                  </p>
                </div>

                {user?.role !== "recruiter" &&
                  (isClosed ? (
                    <Link
                      to="/jobs"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50"
                    >
                      Browse Jobs
                      <ArrowRight size={17} />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={openApplyModal}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50"
                    >
                      Apply Now
                      <Send size={17} />
                    </button>
                  ))}
              </div>
            </section>
          </main>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-xl">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

                <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-white/10 blur-xl" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl font-black backdrop-blur">
                    {job.company
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <p className="mt-5 text-sm text-blue-100">
                    Hiring Company
                  </p>

                  <h3 className="mt-1 text-2xl font-black">
                    {job.company}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-blue-400">
                    <User size={22} />
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Recruiter
                    </p>

                    <p className="mt-1 font-bold">
                      {recruiterName}
                    </p>
                  </div>
                </div>

                {recruiterEmail && (
                  <div className="mt-5 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <Mail
                      size={18}
                      className="shrink-0 text-blue-400"
                    />

                    <span className="truncate text-sm text-slate-400">
                      {recruiterEmail}
                    </span>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Experience
                    </span>

                    <span className="text-sm font-semibold">
                      {job.experience}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Job Type
                    </span>

                    <span className="text-sm font-semibold capitalize">
                      {job.jobType.replace(
                        "-",
                        " "
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Salary
                    </span>

                    <span className="text-sm font-bold text-green-400">
                      ₹
                      {job.salary.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-4 py-3">
                    <span className="text-sm text-slate-500">
                      Status
                    </span>

                    <span
                      className={`text-sm font-bold ${
                        isClosed
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {isClosed
                        ? "Closed"
                        : "Active"}
                    </span>
                  </div>
                </div>

                {user?.role !== "recruiter" &&
                  (isClosed ? (
                    <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 px-5 py-4 text-sm font-bold text-slate-500">
                      <X size={18} />
                      Applications Closed
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={openApplyModal}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 font-bold transition-all hover:-translate-y-1 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
                    >
                      <Send size={18} />
                      Apply for this Job
                    </button>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showApplyModal && !isClosed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 p-6">
              <div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Send size={18} />

                  <span className="text-sm font-semibold">
                    Apply Now
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-bold">
                  {job.title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {job.company}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowApplyModal(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleApply}
              className="p-6 sm:p-8"
            >
              <label className="text-sm font-semibold text-slate-300">
                Cover Letter
              </label>

              <textarea
                value={coverLetter}
                onChange={(event) =>
                  setCoverLetter(
                    event.target.value
                  )
                }
                rows={7}
                placeholder="Tell the recruiter why you are a good fit for this role..."
                className="mt-3 w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 p-4 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setShowApplyModal(false)
                  }
                  className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={applying}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={17} />

                  {applying
                    ? "Submitting..."
                    : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
