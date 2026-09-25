import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  FileSearch,
  MapPin,
  Palette,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getAllJobs } from "../services/job.service";
import type { Job } from "../types";

const PublicHome = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
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

    loadJobs();
  }, []);

  const featuredJobs = useMemo(() => {
    return [...jobs]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  }, [jobs]);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const query = params.toString();

    window.location.href = query
      ? `/jobs?${query}`
      : "/jobs";
  };

  const categories = [
    {
      title: "Frontend Development",
      description:
        "Build modern and interactive web experiences.",
      icon: Code2,
      jobs: "React · JavaScript · Next.js",
      gradient:
        "from-blue-500/20 to-cyan-500/5",
      iconStyle:
        "bg-blue-500/10 text-blue-400"
    },
    {
      title: "Backend Development",
      description:
        "Create powerful APIs and server-side systems.",
      icon: Database,
      jobs: "Node.js · Express · APIs",
      gradient:
        "from-purple-500/20 to-pink-500/5",
      iconStyle:
        "bg-purple-500/10 text-purple-400"
    },
    {
      title: "UI / UX Design",
      description:
        "Design beautiful experiences people love.",
      icon: Palette,
      jobs: "Figma · Design · Research",
      gradient:
        "from-pink-500/20 to-orange-500/5",
      iconStyle:
        "bg-pink-500/10 text-pink-400"
    },
    {
      title: "Full Stack Development",
      description:
        "Work across frontend, backend and databases.",
      icon: Rocket,
      jobs: "MERN · TypeScript · MongoDB",
      gradient:
        "from-green-500/20 to-emerald-500/5",
      iconStyle:
        "bg-green-500/10 text-green-400"
    }
  ];

  const stats = [
    {
      value: `${jobs.length}+`,
      label: "Active Jobs",
      icon: Briefcase
    },
    {
      value: "100+",
      label: "Companies",
      icon: Building2
    },
    {
      value: "1K+",
      label: "Job Seekers",
      icon: Users
    },
    {
      value: "24/7",
      label: "Opportunity",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* HERO */}

      <section className="relative min-h-[calc(100vh-73px)] overflow-hidden">

        <div className="pointer-events-none absolute left-[-15rem] top-[-10rem] h-[38rem] w-[38rem] rounded-full bg-blue-600/20 blur-[130px]" />

        <div className="pointer-events-none absolute right-[-15rem] top-20 h-[38rem] w-[38rem] rounded-full bg-purple-600/20 blur-[130px]" />

        <div className="pointer-events-none absolute bottom-[-15rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">

          <div className="grid w-full items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">

            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
                <Sparkles size={16} />
                The smarter way to find your next opportunity
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">

                Find work that

                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  moves you forward.
                </span>

              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                Discover meaningful opportunities, connect
                with growing companies, and take the next
                step in your career from one powerful platform.
              </p>

              <div className="mt-9 rounded-3xl border border-white/10 bg-white/[0.05] p-3 shadow-2xl shadow-blue-950/20 backdrop-blur-2xl">

                <div className="grid gap-2 lg:grid-cols-[1fr_0.75fr_auto]">

                  <div className="relative">
                    <Search
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      placeholder="Job title, skill or company"
                      className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 py-4 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500"
                    />
                  </div>

                  <div className="relative">
                    <MapPin
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      value={location}
                      onChange={(event) =>
                        setLocation(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleSearch();
                        }
                      }}
                      placeholder="Location"
                      className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 py-4 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 text-sm font-bold transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/20"
                  >
                    Search
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </button>

                </div>

              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">

                <span className="flex items-center gap-2">
                  <CheckCircle2
                    size={16}
                    className="text-green-400"
                  />
                  Verified opportunities
                </span>

                <span className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-blue-400"
                  />
                  Secure applications
                </span>

              </div>

            </div>

            {/* 3D VISUAL */}

            <div className="relative hidden min-h-[560px] lg:block">

              <div className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-500/10 bg-blue-500/5 shadow-[0_0_120px_rgba(59,130,246,0.15)]" />

              <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-500/10 bg-purple-500/5" />

              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[2rem] bg-gradient-to-br from-blue-500 to-purple-700 opacity-20 blur-2xl" />

              <div className="absolute left-1/2 top-1/2 w-[340px] -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl transition duration-700 hover:rotate-0">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-black">
                      JS
                    </div>

                    <div>
                      <p className="font-bold">
                        Full Stack Developer
                      </p>

                      <p className="text-xs text-slate-500">
                        Technology Company
                      </p>
                    </div>

                  </div>

                  <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                    New
                  </span>

                </div>

                <div className="mt-7 space-y-3">

                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <MapPin size={16} />
                    Delhi NCR
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Briefcase size={16} />
                    Full Time
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <Zap
                      size={16}
                      className="text-yellow-400"
                    />
                    ₹8,00,000 / year
                  </div>

                </div>

                <div className="mt-7 flex gap-2">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    React
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    Node.js
                  </span>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                    MongoDB
                  </span>
                </div>

              </div>

              <div className="absolute left-0 top-20 w-56 rotate-[-8deg] rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl transition duration-500 hover:rotate-0">

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
                    <Code2 size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Frontend
                    </p>

                    <p className="text-xs text-slate-500">
                      42 new jobs
                    </p>
                  </div>
                </div>

              </div>

              <div className="absolute bottom-16 right-0 w-56 rotate-[7deg] rounded-2xl border border-white/10 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl transition duration-500 hover:rotate-0">

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-green-500/10 p-3 text-green-400">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Application Sent
                    </p>

                    <p className="text-xs text-slate-500">
                      Your journey started
                    </p>
                  </div>
                </div>

              </div>

              <div className="absolute right-8 top-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-blue-400 shadow-xl backdrop-blur-xl">
                <Rocket size={25} />
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="relative border-y border-white/10 bg-white/[0.02]">

        <div className="mx-auto grid max-w-7xl gap-px px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group flex items-center gap-4 border-white/10 px-5 py-7 sm:justify-center sm:border-r"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition duration-300 group-hover:scale-110">
                  <Icon size={20} />
                </div>

                <div>
                  <p className="text-2xl font-black">
                    {stat.value}
                  </p>

                  <p className="text-xs text-slate-500">
                    {stat.label}
                  </p>
                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* CATEGORIES */}

      <section className="relative px-4 py-24 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
                <Sparkles size={16} />
                Explore possibilities
              </div>

              <h2 className="text-3xl font-black sm:text-4xl">
                Find your space.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Explore opportunities across the most
                in-demand technology and creative fields.
              </p>
            </div>

            <Link
              to="/jobs"
              className="group inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              Explore all jobs
              <ChevronRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  to="/jobs"
                  key={category.title}
                  className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${category.gradient} p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:shadow-2xl`}
                >

                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/5 transition duration-500 group-hover:scale-150" />

                  <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${category.iconStyle}`}>
                    <Icon size={23} />
                  </div>

                  <h3 className="relative mt-6 text-lg font-bold">
                    {category.title}
                  </h3>

                  <p className="relative mt-2 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>

                  <p className="relative mt-5 text-xs font-semibold text-slate-400">
                    {category.jobs}
                  </p>

                  <div className="relative mt-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 transition group-hover:translate-x-1 group-hover:bg-blue-500 group-hover:text-white">
                    <ArrowRight size={16} />
                  </div>

                </Link>
              );
            })}

          </div>

        </div>

      </section>

      {/* FEATURED JOBS */}

      <section className="relative bg-white/[0.02] px-4 py-24 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-purple-400">
                <Zap size={16} />
                Fresh opportunities
              </div>

              <h2 className="text-3xl font-black sm:text-4xl">
                Latest jobs.
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Discover the newest opportunities posted
                by recruiters.
              </p>
            </div>

            <Link
              to="/jobs"
              className="group inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              View all jobs
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>

          </div>

          {loading ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {Array.from({
                length: 6
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-3xl bg-slate-900"
                />
              ))}

            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-16 text-center">

              <Briefcase
                size={40}
                className="mx-auto text-slate-700"
              />

              <h3 className="mt-5 text-xl font-bold">
                No jobs available yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                New opportunities will appear here when
                recruiters post jobs.
              </p>

            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {featuredJobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-950/30"
                >

                  <div className="absolute right-[-4rem] top-[-4rem] h-32 w-32 rounded-full bg-blue-500/5 transition duration-500 group-hover:scale-150" />

                  <div className="relative flex items-start justify-between">

                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 font-black shadow-lg shadow-blue-500/10">
                      {job.company
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold capitalize text-blue-300">
                      {job.jobType.replace(
                        "-",
                        " "
                      )}
                    </span>

                  </div>

                  <h3 className="relative mt-6 line-clamp-2 text-xl font-bold transition group-hover:text-blue-400">
                    {job.title}
                  </h3>

                  <p className="relative mt-1 text-sm font-medium text-slate-500">
                    {job.company}
                  </p>

                  <div className="relative mt-5 space-y-3">

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <MapPin
                        size={16}
                        className="text-blue-400"
                      />
                      <span className="truncate">
                        {job.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Briefcase
                        size={16}
                        className="text-purple-400"
                      />
                      {job.experience}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Zap
                        size={16}
                        className="text-yellow-400"
                      />
                      ₹{job.salary.toLocaleString("en-IN")}
                    </div>

                  </div>

                  <div className="relative mt-6 flex flex-wrap gap-2">

                    {job.skills
                      .slice(0, 3)
                      .map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-400 transition group-hover:bg-blue-500/10 group-hover:text-blue-300"
                        >
                          {skill}
                        </span>
                      ))}

                    {job.skills.length > 3 && (
                      <span className="rounded-full bg-slate-800 px-3 py-1.5 text-xs text-slate-500">
                        +{job.skills.length - 3}
                      </span>
                    )}

                  </div>

                  <div className="relative mt-6 flex items-center justify-between border-t border-slate-800 pt-5">

                    <span className="text-xs font-semibold text-slate-600">
                      Posted recently
                    </span>

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition group-hover:translate-x-1 group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowRight size={16} />
                    </span>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="relative px-4 py-24 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
              <Zap size={16} />
              Simple by design
            </div>

            <h2 className="text-3xl font-black sm:text-4xl">
              From searching to hired.
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Everything you need to move from opportunity
              to application in just a few simple steps.
            </p>

          </div>

          <div className="relative mt-16 grid gap-8 md:grid-cols-3">

            <div className="absolute left-[18%] right-[18%] top-12 hidden h-px bg-gradient-to-r from-blue-500/0 via-blue-500/30 to-purple-500/0 md:block" />

            {[
              {
                number: "01",
                title: "Discover",
                description:
                  "Search thousands of opportunities using skills, location and job type.",
                icon: Search
              },
              {
                number: "02",
                title: "Apply",
                description:
                  "Create your profile, upload your resume and send applications in seconds.",
                icon: FileSearch
              },
              {
                number: "03",
                title: "Get Hired",
                description:
                  "Track your applications and connect with recruiters throughout the process.",
                icon: Rocket
              }
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative text-center"
                >

                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-blue-500/20 bg-slate-900 shadow-2xl shadow-blue-950/20 transition duration-500 hover:-translate-y-2 hover:rotate-3">

                    <Icon
                      size={30}
                      className="text-blue-400"
                    />

                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-black">
                      {step.number}
                    </span>

                  </div>

                  <h3 className="mt-7 text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* RECRUITER CTA */}

      <section className="px-4 pb-24 sm:px-6 lg:px-8">

        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 p-8 shadow-2xl sm:p-12 lg:p-16">

          <div className="absolute right-[-5rem] top-[-7rem] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
                <Building2 size={16} />
                For Recruiters
              </div>

              <h2 className="max-w-2xl text-3xl font-black sm:text-4xl">
                Great people are looking for great companies.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                Post jobs, review candidates, manage applications
                and build your next team from one place.
              </p>

            </div>

            <Link
              to="/create-job"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-blue-50 hover:shadow-2xl"
            >
              Post a Job

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="border-t border-white/10 bg-white/[0.02] px-4 py-20 text-center sm:px-6 lg:px-8">

        <div className="mx-auto max-w-3xl">

          <Sparkles
            size={28}
            className="mx-auto text-blue-400"
          />

          <h2 className="mt-5 text-3xl font-black sm:text-5xl">
            Your next opportunity is closer than you think.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500">
            Start exploring opportunities today and take
            one step closer to the career you want.
          </p>

          <Link
            to="/jobs"
            className="group mt-8 inline-flex items-center gap-3 rounded-2xl bg-blue-600 px-7 py-4 font-bold transition hover:-translate-y-1 hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-500/20"
          >
            Explore Jobs

            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>

        </div>

      </section>

    </div>
  );
};

export default PublicHome ;