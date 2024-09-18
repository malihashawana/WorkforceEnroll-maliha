import express from "express";
import { signup1, login1, getCompanyDetails, getCompanyDetails1 } from "../controller/company.controller.js";

const router = express.Router();

router.post("/signup_company", signup1);
router.post("/login_company", login1);
router.get("/companies", getCompanyDetails);
router.get("/companies1", getCompanyDetails1);

export default router;
