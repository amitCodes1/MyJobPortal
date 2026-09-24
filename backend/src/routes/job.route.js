import express from "express";

import {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob
} from "../controllers/job.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  getAllJobs
);

router.get(
  "/:id",
  getJobById
);

router.post(
  "/",
  protect,
  createJob
);

router.delete(
  "/:id",
  protect,
  deleteJob
);

export default router;