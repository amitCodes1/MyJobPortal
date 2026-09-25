import api from "./api";



export interface ApplyJobData {
  jobId: string;
  coverLetter?: string;
}



export interface Application {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
    salary: number;
    jobType: string;
    experience: string;
    skills: string[];
  };
  applicant?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    resume?: string;
    skills?: string[];
  };
  coverLetter?: string;
  status:
    | "applied"
    | "shortlisted"
    | "rejected"
    | "selected";
  createdAt: string;
  updatedAt: string;
}



export const applyForJob = async (
  data: ApplyJobData
) => {
  const response = await api.post(
    "/applications/apply",
    data
  );

  return response.data as {
    success: boolean;
    message: string;
    application: Application;
  };
};

export const getMyApplications = async () => {
  const response = await api.get(
    "/applications/my-applications"
  );

  return response.data as {
    success: boolean;
    count: number;
    applications: Application[];
  };
};

export const getJobApplications = async (
  jobId: string
) => {
  const response = await api.get(
    `/applications/job/${jobId}`
  );

  return response.data as {
    success: boolean;
    count: number;
    applications: Application[];
  };
};

export const updateApplicationStatus = async (
  applicationId: string,
  status:
    | "applied"
    | "shortlisted"
    | "rejected"
    | "selected"
) => {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    {
      status
    }
  );

  return response.data as {
    success: boolean;
    message: string;
    application: Application;
  };
};