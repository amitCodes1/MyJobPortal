import { useRef, useState } from "react";
import { Upload, User, Mail, Phone, Briefcase, FileText, Pencil, X, Save } from "lucide-react";
import { toast } from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser } from "../store/authSlice";
import {
  getMe,
  updateProfile
} from "../services/auth.service";

const Profile = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [skills, setSkills] = useState(
    user?.skills?.join(", ") || ""
  );

  const handleEdit = () => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setSkills(user?.skills?.join(", ") || "");
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const skillsArray = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const response = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        skills: skillsArray
      });

      dispatch(setUser(response.user));

      setEditing(false);

      toast.success(
        response.message || "Profile updated successfully"
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Profile update failed"
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

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      const token = localStorage.getItem("accessToken");

      const response = await fetch(
        "http://localhost:5000/api/auth/resume",
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

      const userResponse = await getMe();

      dispatch(setUser(userResponse.user));

      toast.success("Resume uploaded successfully");
    } catch (error: any) {
      toast.error(
        error.message || "Resume upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
              My Profile
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Manage Your Profile
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Keep your professional information updated and
              ready for recruiters.
            </p>

          </div>

          {!editing && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl"
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          )}

        </div>

        {editing && (
          <div className="mb-6 overflow-hidden rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-2xl shadow-blue-100/50 backdrop-blur-xl sm:p-8">

            <div className="mb-6">

              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Edit Information
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Update Your Profile
              </h2>

            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separate multiple skills with commas.
                </p>

              </div>

            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

              <button
                onClick={handleCancel}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-blue-100/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl lg:col-span-1">

            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 transition-transform duration-500 group-hover:scale-150" />

            <div className="relative">

              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-1 shadow-xl shadow-blue-300/40 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">

                <div className="flex h-full w-full items-center justify-center rounded-full bg-white">

                  <span className="bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-4xl font-extrabold uppercase text-transparent">
                    {user?.name?.charAt(0) || "U"}
                  </span>

                </div>

              </div>

              <div className="mt-5 text-center">

                <h2 className="text-2xl font-bold text-slate-900">
                  {user?.name || "User"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {user?.email}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold capitalize text-blue-600">
                  <Briefcase size={16} />
                  {user?.role}
                </div>

              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">

                <div className="rounded-2xl bg-slate-50 p-4 text-center transition hover:-translate-y-1 hover:bg-blue-50">
                  <p className="text-2xl font-bold text-blue-600">
                    {user?.skills?.length || 0}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Skills
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-center transition hover:-translate-y-1 hover:bg-purple-50">
                  <p className="text-2xl font-bold text-purple-600">
                    {user?.resume ? "1" : "0"}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Resume
                  </p>
                </div>

              </div>

            </div>

          </div>

          <div className="space-y-6 lg:col-span-2">

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8">

              <div className="mb-6">

                <h2 className="text-xl font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your basic account information
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:bg-blue-50/50 hover:shadow-lg">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:rotate-6">
                    <User size={20} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {user?.name || "Not available"}
                  </p>

                </div>

                <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-purple-100 hover:bg-purple-50/50 hover:shadow-lg">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-transform group-hover:rotate-6">
                    <Mail size={20} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Email
                  </p>

                  <p className="mt-1 break-all font-semibold text-slate-800">
                    {user?.email || "Not available"}
                  </p>

                </div>

                <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-green-100 hover:bg-green-50/50 hover:shadow-lg">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-transform group-hover:rotate-6">
                    <Phone size={20} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {user?.phone || "Not added"}
                  </p>

                </div>

                <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange-100 hover:bg-orange-50/50 hover:shadow-lg">

                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-transform group-hover:rotate-6">
                    <Briefcase size={20} />
                  </div>

                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Account Type
                  </p>

                  <p className="mt-1 font-semibold capitalize text-slate-800">
                    {user?.role || "Not available"}
                  </p>

                </div>

              </div>

            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-8">

              <div className="mb-5">

                <h2 className="text-xl font-bold text-slate-900">
                  Skills
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Technologies and skills in your profile
                </p>

              </div>

              {user?.skills && user.skills.length > 0 ? (

                <div className="flex flex-wrap gap-3">

                  {user.skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-md"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              ) : (

                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-500">
                    No skills added yet.
                  </p>
                </div>

              )}

            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 shadow-2xl shadow-blue-200/30 sm:p-8">

              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-2xl" />

              <div className="absolute -bottom-20 left-20 h-40 w-40 rounded-full bg-purple-500/20 blur-2xl" />

              <div className="relative">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-blue-300 backdrop-blur">
                      <FileText size={24} />
                    </div>

                    <h2 className="text-xl font-bold text-white">
                      Resume
                    </h2>

                    <p className="mt-1 max-w-md text-sm leading-6 text-slate-300">
                      Upload your latest resume so recruiters can
                      review your professional profile.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={uploading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload size={18} />

                    {uploading
                      ? "Uploading..."
                      : user?.resume
                        ? "Replace Resume"
                        : "Upload Resume"}
                  </button>

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />

                {user?.resume && (

                  <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-300">
                      <FileText size={20} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-semibold text-white">
                        Resume uploaded
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {user.resume}
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;