import express from 'express';
import { addJob, searchJobs, getAllJobs, getJobsByCompany, getJobById, updateJob, deleteJob,toggleBookmark, getBookmarkedJobs,toggleBookmarkCompany,getBookmarkedJobsByCompany} from '../controller/jobs.controller.js';


const router = express.Router();


// adding new
router.post('/addjobs', addJob);


// geting all jobs
router.get('/all', getAllJobs);


// geting all jobs for a specific company
router.get('/', getJobsByCompany);


// geting a single job by ID
router.get('/:id', getJobById);


//Edit
router.put('/:id', updateJob);


//delete
router.delete('/:id', deleteJob);


// Toggle bookmark
router.post('/bookmark', toggleBookmark);


// Get bookmarked jobs for a user
// In your backend routes file (e.g., `jobs.route.js`)
router.get('/bookmarked/:userId', getBookmarkedJobs);


// Toggle bookmark status for company
router.post('/bookmark/company', toggleBookmarkCompany);

// Fetch bookmarked jobs for a company
router.get('/bookmarked-jobs/:companyId', getBookmarkedJobsByCompany);

router.get('/search', searchJobs);
export default router;