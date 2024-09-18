import express from "express";
import { signup,login,getJobseekers } from "../controller/user.controller.js";
const router=express.Router()
router.post("/signup_jobseeker",signup)
router.post("/login_jobseeker",login)
router.get('/jobseekers', getJobseekers);
//router.put("/jobseekers/:id", updateJobseeker);

export default router;