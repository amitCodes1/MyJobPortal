export type UserRole = "jobseeker" | "recruiter";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  resume?: string;
  skills: string[];
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  jobType: "full-time" | "part-time" | "internship" | "contract";
  experience: string;
  skills: string[];
  status: "active" | "closed";
  recruiter: string | {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}