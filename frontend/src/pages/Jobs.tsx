import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock3,
  SlidersHorizontal,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getAllJobs } from "../services/job.service";
import type { Job } from "../types";

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const response = await getAllJobs();

        setJobs(response.jobs);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue = search.toLowerCase().trim();
      const locationValue = location.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        job.title.toLowerCase().includes(searchValue) ||
        job.company.toLowerCase().includes(searchValue) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchValue)
        );

      const matchesLocation =
        !locationValue ||
        job.location
          .toLowerCase()
          .includes(locationValue);

      const matchesJobType =
        !jobType ||
        job.jobType === jobType;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesJobType
      );
    });
  }, [jobs, search, location, jobType]);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-32 h-80 w-80 rounded-full bg-purple-300/25 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        <div className="mb-8 text-center">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
            <Sparkles size={16} />
            Find Your Next Opportunity
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Find Your Dream Job
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Discover opportunities that match your skills,
            experience and career goals.
          </p>

        </div>

        <div className="mb-8 rounded-3xl border border-white/70 bg-white/80 p-4 shadow-2xl shadow-blue-100/40 backdrop-blur-xl sm:p-6">

          <div className="grid gap-3 lg:grid-cols-12">

            <div className="relative lg:col-span-5">

              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search job, company or skill..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

            <div className="relative lg:col-span-3">

              <MapPin
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Location"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />

            </div>

            <div className="relative lg:col-span-2">

              <Briefcase
                size={20}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={jobType}
                onChange={(event) =>
                  setJobType(event.target.value)
                }
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm capitalize outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="">
                  All Job Types
                </option>

                <option value="full-time">
                  Full Time
                </option>

                <option value="part-time">
                  Part Time
                </option>

                <option value="internship">
                  Internship
                </option>

                <option value="contract">
                  Contract
                </option>
              </select>

            </div>

            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-lg lg:col-span-2"
            >
              <SlidersHorizontal size={18} />
              Clear
            </button>

          </div>

        </div>

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Available Jobs
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1
                ? "job"
                : "jobs"}{" "}
              found
            </p>

          </div>

        </div>

        {loading ? (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3, 4, 5, 6].map((item) => (

              <div
                key={item}
                className="h-80 animate-pulse rounded-3xl bg-white shadow-lg"
              />

            ))}

          </div>

        ) : filteredJobs.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 px-6 py-16 text-center shadow-lg backdrop-blur">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Briefcase size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No jobs found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try changing your search keywords, location
              or job type.
            </p>

            <button
              onClick={clearFilters}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {filteredJobs.map((job) => (

              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:rotate-[0.5deg] hover:shadow-2xl hover:shadow-blue-200/40"
              >

                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/10 transition-transform duration-500 group-hover:scale-150" />

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-500 group-hover:w-full" />

                <div className="relative">

                  <div className="mb-5 flex items-start justify-between gap-3">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-extrabold text-white shadow-lg shadow-blue-200 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                      {job.company.charAt(0).toUpperCase()}
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold capitalize text-blue-600">
                      {job.jobType.replace("-", " ")}
                    </span>

                  </div>

                  <h3 className="line-clamp-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {job.title}
                  </h3>

                  <p className="mt-1 font-medium text-slate-500">
                    {job.company}
                  </p>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-slate-600">

                      <MapPin
                        size={17}
                        className="shrink-0 text-blue-500"
                      />

                      <span className="truncate">
                        {job.location}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">

                      <IndianRupee
                        size={17}
                        className="shrink-0 text-green-500"
                      />

                      <span>
                        ₹{job.salary.toLocaleString("en-IN")}
                      </span>

                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">

                      <Clock3
                        size={17}
                        className="shrink-0 text-purple-500"
                      />

                      <span>
                        {job.experience}
                      </span>

                    </div>

                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {job.skills.slice(0, 4).map(
                      (skill, index) => (

                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 transition group-hover:bg-blue-50 group-hover:text-blue-600"
                        >
                          {skill}
                        </span>

                      )
                    )}

                    {job.skills.length > 4 && (

                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                        +{job.skills.length - 4}
                      </span>

                    )}

                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

                    <span className="text-sm font-semibold text-slate-400">
                      View Details
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white">
                      →
                    </span>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Jobs;