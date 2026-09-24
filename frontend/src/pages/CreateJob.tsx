import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Layers3,
  Sparkles,
  FileText,
  Send
} from "lucide-react";
import { toast } from "react-hot-toast";

import { createJob } from "../services/job.service";

const CreateJob = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState<
    "full-time" |
    "part-time" |
    "internship" |
    "contract"
  >("full-time");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !description.trim() ||
      !company.trim() ||
      !location.trim() ||
      !salary ||
      !experience.trim() ||
      !skills.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await createJob({
        title: title.trim(),
        description: description.trim(),
        company: company.trim(),
        location: location.trim(),
        salary: Number(salary),
        jobType,
        experience: experience.trim(),
        skills: skillsArray
      });

      toast.success(
        response.message || "Job created successfully"
      );

      navigate("/jobs");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-purple-300/25 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">

        <div className="mb-8 text-center">

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
            <Sparkles size={16} />
            Recruiter Dashboard
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Create a New Job
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Publish a professional job listing and connect
            with talented candidates.
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-2xl shadow-blue-100/50 backdrop-blur-xl">

            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-6 py-8 sm:px-10">

              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

              <div className="absolute -bottom-24 left-20 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

              <div className="relative flex items-center gap-4">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-blue-300 shadow-lg backdrop-blur">
                  <Briefcase size={28} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Job Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-300">
                    Add the details candidates need to know.
                  </p>

                </div>

              </div>

            </div>

            <div className="space-y-8 p-6 sm:p-10">

              <div className="grid gap-6 md:grid-cols-2">

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Job Title
                  </label>

                  <div className="relative">

                    <Briefcase
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      placeholder="e.g. Frontend Developer"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company
                  </label>

                  <div className="relative">

                    <Building2
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={company}
                      onChange={(event) =>
                        setCompany(event.target.value)
                      }
                      placeholder="Company name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>

                  <div className="relative">

                    <MapPin
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={location}
                      onChange={(event) =>
                        setLocation(event.target.value)
                      }
                      placeholder="e.g. Delhi, India"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Salary
                  </label>

                  <div className="relative">

                    <IndianRupee
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="1"
                      value={salary}
                      onChange={(event) =>
                        setSalary(event.target.value)
                      }
                      placeholder="e.g. 600000"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Experience
                  </label>

                  <div className="relative">

                    <Layers3
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={experience}
                      onChange={(event) =>
                        setExperience(event.target.value)
                      }
                      placeholder="e.g. 0-2 years"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Job Type
                  </label>

                  <select
                    value={jobType}
                    onChange={(event) =>
                      setJobType(
                        event.target.value as
                          | "full-time"
                          | "part-time"
                          | "internship"
                          | "contract"
                      )
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm capitalize outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  >
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

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Skills
                  </label>

                  <input
                    type="text"
                    value={skills}
                    onChange={(event) =>
                      setSkills(event.target.value)
                    }
                    placeholder="React, JavaScript, Node.js, MongoDB"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Separate skills with commas.
                  </p>

                </div>

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Job Description
                  </label>

                  <div className="relative">

                    <FileText
                      size={19}
                      className="absolute left-4 top-5 text-slate-400"
                    />

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      placeholder="Describe the role, responsibilities, requirements and expectations..."
                      rows={7}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                  </div>

                </div>

              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => navigate("/jobs")}
                  disabled={loading}
                  className="rounded-2xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 font-semibold text-white shadow-xl shadow-blue-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={18} />

                  {loading
                    ? "Publishing..."
                    : "Publish Job"}
                </button>

              </div>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateJob;