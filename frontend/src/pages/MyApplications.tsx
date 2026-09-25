import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  XCircle,
  UserCheck
} from "lucide-react";
import { toast } from "react-hot-toast";

import { getMyApplications } from "../services/application.service";

import type { Application } from "../services/application.service";

const MyApplications = () => {
  const [applications, setApplications] = useState<
    Application[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await getMyApplications();

        setApplications(response.applications);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const getStatusStyle = (
    status: Application["status"]
  ) => {
    if (status === "selected") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (status === "shortlisted") {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    }

    if (status === "rejected") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const getStatusIcon = (
    status: Application["status"]
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-10 w-64 rounded-lg bg-slate-800" />

          <div className="mt-10 grid gap-6">
            {Array.from({ length: 4 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-64 rounded-3xl bg-slate-900"
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
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <Briefcase size={16} />
            Job Applications
          </div>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            My Applications
          </h1>

          <p className="mt-2 text-slate-400">
            Track the jobs you have applied for.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center shadow-xl">
            <Briefcase
              size={42}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-5 text-2xl font-bold">
              No Applications Yet
            </h2>

            <p className="mt-2 text-slate-400">
              You have not applied for any jobs yet.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-500"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => {
              if (!application.job) {
                return (
                  <div
                    key={application._id}
                    className="rounded-3xl border border-red-500/20 bg-slate-900 p-6 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                        <XCircle size={24} />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold">
                          Job No Longer Available
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                          This job has been removed by the recruiter.
                        </p>

                        <p className="mt-3 text-xs text-slate-500">
                          Application ID: {application._id}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={application._id}
                  className="group rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/10 sm:p-8"
                >
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {application.job.title}
                        </h2>

                        <div className="mt-3 flex items-center gap-2 text-blue-400">
                          <Building2 size={17} />

                          <span className="font-medium">
                            {application.job.company}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold capitalize ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {getStatusIcon(application.status)}

                        {application.status}
                      </span>
                    </div>

                    <div className="grid gap-4 text-sm text-slate-400 sm:grid-cols-3">
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="text-slate-500"
                        />

                        <span>
                          {application.job.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Briefcase
                          size={17}
                          className="text-slate-500"
                        />

                        <span className="capitalize">
                          {application.job.jobType}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-400">
                          ₹
                        </span>

                        <span>
                          {application.job.salary.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {application.job.skills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-300"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>

                    {application.coverLetter && (
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Cover Letter
                        </p>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs text-slate-500">
                          Applied On
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-300">
                          {new Date(
                            application.createdAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </div>

                      <Link
                        to={`/jobs/${application.job._id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-500"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;