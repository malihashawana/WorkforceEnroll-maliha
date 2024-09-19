import express from 'express';
import { saveOrUpdateProfile } from '../controller/profile.controller.js';


const router = express.Router();


// Route to handle profile save or update
router.put('/profiles', saveOrUpdateProfile);


export default router;
