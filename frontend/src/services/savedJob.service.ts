import api from "./api";
import type { Job } from "../types";

export interface SavedJob {
  _id: string;
  job: Job;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export const saveJob = async (jobId: string) => {
  const response = await api.post(
    "/saved-jobs",
    {
      jobId
    }
  );

  return response.data as {
    success: boolean;
    message: string;
    savedJob: SavedJob;
  };
};

export const getSavedJobs = async () => {
  const response = await api.get(
    "/saved-jobs"
  );

  return response.data as {
    success: boolean;
    count: number;
    savedJobs: SavedJob[];
  };
};

export const removeSavedJob = async (
  jobId: string
) => {
  const response = await api.delete(
    `/saved-jobs/${jobId}`
  );

  return response.data as {
    success: boolean;
    message: string;
  };
};