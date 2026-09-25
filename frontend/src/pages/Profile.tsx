import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  Save,
  Download,
  CheckCircle2
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  getMe,
  updateProfile
} from "../services/auth.service";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser } from "../store/authSlice";

const Profile = () => {
  const { user } = useAppSelector(
    (state) => state.auth
  );

  const dispatch = useAppDispatch();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMe();

        const currentUser = response.user;

        dispatch(setUser(currentUser));

        setName(currentUser.name || "");
        setPhone(currentUser.phone || "");
        setSkills(
          currentUser.skills?.join(", ") || ""
        );
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [dispatch]);

  const handleUpdateProfile = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setSaving(true);

      const skillArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await updateProfile({
        name,
        phone,
        skills: skillArray
      });

      dispatch(setUser(response.user));

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);

      const token =
        localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/resume`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Resume upload failed"
        );
      }

      dispatch(setUser(data.user));

      toast.success("Resume uploaded successfully");
    } catch (error: any) {
      toast.error(
        error.message || "Resume upload failed"
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getResumeUrl = () => {
    if (!user?.resume) {
      return "";
    }

    const baseUrl = import.meta.env.VITE_API_URL.replace(
      "/api",
      ""
    );

    return `${baseUrl}${user.resume}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-10 w-48 rounded-lg bg-slate-800" />

          <div className="mt-8 h-96 rounded-3xl bg-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <User size={16} />
            My Profile
          </div>

          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">
            Profile Settings
          </h1>

          <p className="mt-2 text-slate-400">
            Keep your profile updated for better job opportunities.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-3xl font-bold shadow-lg shadow-blue-500/20">
              {user?.name
                ?.charAt(0)
                .toUpperCase()}
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              {user?.name}
            </h2>

            <p className="mt-1 text-sm text-blue-400">
              {user?.role === "jobseeker"
                ? "Jobseeker"
                : "Recruiter"}
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail
                  size={18}
                  className="mt-0.5 text-slate-500"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm text-slate-300">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone
                  size={18}
                  className="mt-0.5 text-slate-500"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {user?.phone || "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText
                  size={18}
                  className="mt-0.5 text-slate-500"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Resume
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {user?.resume
                      ? "Uploaded"
                      : "Not uploaded"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form
              onSubmit={handleUpdateProfile}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8"
            >
              <h2 className="text-2xl font-bold">
                Personal Information
              </h2>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/60 py-3 pl-11 pr-4 text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Phone
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Role
                  </label>

                  <input
                    type="text"
                    value={
                      user?.role === "jobseeker"
                        ? "Jobseeker"
                        : "Recruiter"
                    }
                    disabled
                    className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Skills
                  </label>

                  <input
                    type="text"
                    value={skills}
                    onChange={(event) =>
                      setSkills(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                    placeholder="React, JavaScript, Node.js, MongoDB"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Separate multiple skills with commas.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold">
                    <FileText className="text-blue-400" />
                    Resume
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Upload your latest resume in PDF format.
                  </p>
                </div>

                {user?.resume && (
                  <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                    <CheckCircle2 size={17} />
                    Resume Uploaded
                  </div>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 p-6">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                    <Upload size={28} />
                  </div>

                  <h3 className="mt-4 font-semibold">
                    Upload Resume
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    PDF only, maximum 5MB
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload size={17} />

                    {uploading
                      ? "Uploading..."
                      : "Choose Resume"}
                  </button>

                  {user?.resume && (
                    <a
                      href={getResumeUrl()}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                    >
                      <Download size={16} />
                      View / Download Resume
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;