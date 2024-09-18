import express from "express";
import { login2, signup2 } from "../controller/admin1.controller.js";
const router=express.Router()
router.post("/signup_admin",signup2)
router.post("/login_admin",login2)
export default router;