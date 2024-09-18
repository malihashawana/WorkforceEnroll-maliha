import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    applyForJob,
    getUserApplications,
    updateApplication,
    deleteApplication,
    getApplicationsForJob,
    acceptApplication,
    rejectApplication,
    getAcceptedApplications,
    getRejectedApplications,
    deleteApplicationFromCompany,
    getApplicationCountsForJob,
    getAcceptedApplicationsCountForJob,
    getRejectedApplicationsCountForJob,
    hasUserAppliedForJob,
    deleteApplicationFromJobseeker,
    getApplicants
    

} from '../controller/applications.controller.js';

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only .pdf, .doc, .docx, .jpg, .jpeg, .png files are allowed!'));
    }
});

// Apply for a job (with file uploads)
router.post('/addapplication', upload.fields([{ name: 'coverLetter', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), applyForJob);

// Get all applications for a specific user
router.get('/:userId', getUserApplications);

// Edit an application (with potential file uploads)

// Update an existing application (with file uploads)
// Update an existing application
router.put('/updateapplication', upload.fields([{ name: 'coverLetter', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), updateApplication);




// Delete an application
router.delete('/:applicationId', deleteApplication);


// Get all applications (optional status filter)
router.get('/job/:jobId', getApplicationsForJob);




// Accept an application
//router.put('/applications/:applicationId/accept', acceptApplication);
router.put('/:applicationId/accept', acceptApplication);
//router.get('/accepted', getAcceptedApplications);
// Get all accepted applications for jobs created by a company
//router.get('/accepted-applications/:companyId', getAcceptedApplications);
// Add this route to get all accepted applications for a company
router.get('/company/:companyId/accepted', getAcceptedApplications);




// Reject an application
router.put('/:applicationId/reject', rejectApplication);
router.get('/company/:companyId/rejected', getRejectedApplications);

// DELETE /applications/:applicationId/delete
router.delete('/:applicationId/delete', deleteApplicationFromCompany);


// routes/applications.route.js
router.get('/job/:jobId/counts', getApplicationCountsForJob);

// Add routes for counting accepted and rejected applications
router.get('/jobs/:jobId/accepted-count', getAcceptedApplicationsCountForJob);
router.get('/jobs/:jobId/rejected-count', getRejectedApplicationsCountForJob);

// Define the route for checking application status
router.get('/check-application/:userId/:jobId', hasUserAppliedForJob);


// New route to update application status to 'Deletedby' by jobseeker
router.delete('/jobseeker/:applicationId', deleteApplicationFromJobseeker);

router.get('/applications/:companyId', getApplicants);

export default router;
