import api from "./api";
import type { Job } from "../types";

export interface CreateJobData {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  jobType:
    | "full-time"
    | "part-time"
    | "internship"
    | "contract";
  experience: string;
  skills: string[];
}

export const getAllJobs = async () => {
  const response = await api.get("/jobs");

  return response.data as {
    success: boolean;
    count: number;
    jobs: Job[];
  };
};

export const getJobById = async (id: string) => {
  const response = await api.get(`/jobs/${id}`);

  return response.data as {
    success: boolean;
    job: Job;
  };
};

export const createJob = async (
  data: CreateJobData
) => {
  const response = await api.post("/jobs", data);

  return response.data as {
    success: boolean;
    message: string;
    job: Job;
  };
};