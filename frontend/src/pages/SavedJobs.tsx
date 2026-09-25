import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Bookmark, Trash2 } from "lucide-react";

import {
  getSavedJobs,
  removeSavedJob
} from "../services/savedJob.service";

import type { SavedJob } from "../services/savedJob.service";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const response = await getSavedJobs();

        setSavedJobs(response.savedJobs);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load saved jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, []);

  const handleRemove = async (jobId: string) => {
    try {
      await removeSavedJob(jobId);

      setSavedJobs((jobs) =>
        jobs.filter((savedJob) => savedJob.job._id !== jobId)
      );

      toast.success("Job removed from saved jobs");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to remove saved job"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-10 text-white">
        <h1 className="text-3xl font-bold">
          Loading saved jobs...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <Bookmark className="text-blue-400" />

            <h1 className="text-3xl font-bold">
              Saved Jobs
            </h1>
          </div>

          <p className="mt-2 text-slate-400">
            Jobs you saved for later.
          </p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <Bookmark
              size={40}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-xl font-semibold">
              No Saved Jobs
            </h2>

            <p className="mt-2 text-slate-400">
              You have not saved any jobs yet.
            </p>

            <Link
              to="/jobs"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {savedJobs.map((savedJob) => (
              <div
                key={savedJob._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <h2 className="text-2xl font-bold">
                  {savedJob.job.title}
                </h2>

                <p className="mt-2 text-blue-400">
                  {savedJob.job.company}
                </p>

                <div className="mt-4 space-y-2 text-slate-400">
                  <p>
                    Location: {savedJob.job.location}
                  </p>

                  <p>
                    Salary: ₹
                    {savedJob.job.salary.toLocaleString("en-IN")}
                  </p>

                  <p>
                    Job Type: {savedJob.job.jobType}
                  </p>

                  <p>
                    Experience: {savedJob.job.experience}
                  </p>
                </div>

                <p className="mt-4 text-slate-400">
                  {savedJob.job.description}
                </p>

                <div className="mt-6 flex gap-3">
                  <Link
                    to={`/jobs/${savedJob.job._id}`}
                    className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
                  >
                    View Job
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(savedJob.job._id)
                    }
                    className="flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 font-semibold text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 size={17} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;