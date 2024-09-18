import mongoose from "mongoose";
import Application from "../model/applications.model.js";
import Job from "../model/jobs.model.js";
import User1 from "../model/company.model.js"; // Make sure this is the correct path




export const applyForJob = async (req, res) => {
    //console.log("Request Files:", req.files);
    //console.log("Request Body:", req.body);




    const { userId, jobId, fullName, email, phoneNumber, expectedSalary, currentJobTitle, currentJobEmployer, termsAccepted } = req.body;




    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId format' });
    }




    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: 'Invalid jobId format' });
    }




    // Check if files are included in the request
    if (!req.files || !req.files['cv']) {
        return res.status(400).json({ message: 'CV file is required.' });
    }




    const coverLetter = req.files['coverLetter'] ? `/uploads/${req.files['coverLetter'][0].filename}` : null;
    const cv = `/uploads/${req.files['cv'][0].filename}`;
    

    // Extract original filenames
    const coverLetterOriginalName = req.files['coverLetter'] ? req.files['coverLetter'][0].originalname : null;
    const cvOriginalName = req.files['cv'][0].originalname;



    try {
        // Fetch job details and populate company information
        const job = await Job.findById(jobId).populate('company');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
       
        const companyId = job.company ? job.company._id : null;
        if (!companyId) {
            return res.status(500).json({ message: 'Company ID could not be retrieved' });
        }




        // Check if the user has already applied for this job
        const existingApplication = await Application.findOne({ userId, jobId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job.' });
        }

       // Check if the email has already been used for this job
       const emailExists = await Application.findOne({ jobId, email });
       if (emailExists) {
           return res.status(400).json({ message: 'This email has already been used for this job. Try with a different email address.' });
       }


        // Create a new application
        const newApplication = new Application({
            userId,
            jobId,
            companyId, // Use the companyId retrieved from the job
            fullName,
            email,
            phoneNumber,
            expectedSalary,
            currentJobTitle,
            currentJobEmployer,
            coverLetter,
            cv,
            coverLetterOriginalName,
            cvOriginalName,
            termsAccepted,
            status: 'Pending' // Default status
        });




        await newApplication.save();
        return res.status(201).json({ message: 'Application submitted successfully', newApplication });
    } catch (error) {
        console.error('Error during application submission:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};





// Get all applications for a user
export const getUserApplications = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId format' });
    }

    try {
        const applications = await Application.find({ userId })
            .populate({
                path: 'jobId',
                select: 'jobTitle companyName',
                model: 'Job'
            })
            .lean();

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        applications.forEach(application => {
            if (application.coverLetter) {
                application.coverLetterUrl = `${baseUrl}${application.coverLetter}`;
            }
            if (application.cv) {
                application.cvUrl = `${baseUrl}${application.cv}`;
            }
        });

        return res.status(200).json(applications);
    } catch (error) {
        console.error('Error retrieving user applications:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Edit an application (with potential file updates)
// Edit an application
export const updateApplication = async (req, res) => {
    const { applicationId, fullName, email, phoneNumber, expectedSalary, currentJobTitle, currentJobEmployer, termsAccepted } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'Invalid applicationId format' });
    }

    try {
        // Find the application
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update application fields
        application.fullName = fullName || application.fullName;
        application.email = email || application.email;
        application.phoneNumber = phoneNumber || application.phoneNumber;
        application.expectedSalary = expectedSalary || application.expectedSalary;
        application.currentJobTitle = currentJobTitle || application.currentJobTitle;
        application.currentJobEmployer = currentJobEmployer || application.currentJobEmployer;
        application.termsAccepted = termsAccepted || application.termsAccepted;

        // Handle file updates
        if (req.files) {
            if (req.files['coverLetter']) {
                application.coverLetter = `/uploads/${req.files['coverLetter'][0].filename}`;
                application.coverLetterOriginalName = req.files['coverLetter'][0].originalname;
            }
            if (req.files['cv']) {
                application.cv = `/uploads/${req.files['cv'][0].filename}`;
                application.cvOriginalName = req.files['cv'][0].originalname;
            }
        }

        // Save the updated application
        await application.save();

        res.status(200).json({ 
            message: 'Application updated successfully', 
            application: {
                ...application.toObject(), 
                coverLetterOriginalName: application.coverLetterOriginalName,
                cvOriginalName: application.cvOriginalName
            } 
        });
    } catch (error) {
        console.error('Error during application update:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};



// Delete an application
export const deleteApplication = async (req, res) => {
    const { applicationId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'Invalid applicationId format' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId format' });
    }

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this application' });
        }

        await Application.findByIdAndDelete(applicationId);
        return res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Get all applications for a specific job





// Get all applications for a specific job based on status (pending, accepted, rejected)
// Get all applications for a specific job based on status (pending, accepted, rejected)
export const getApplicationsForJob1 = async (req, res) => {
    const { jobId } = req.params;
    const { status } = req.query; // Get the status from the query parameter

    const query = { jobId };
    if (status) {
        query.status = status; // Make sure status matches the case in your database
    }

    try {
        const applications = await Application.find(query)
            .populate({
                path: 'userId',
                select: 'fullName email phoneNumber',
                model: 'User'
            })
            .lean();

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        applications.forEach(application => {
            if (application.coverLetter) {
                application.coverLetterUrl = `${baseUrl}${application.coverLetter}`;
            }
            if (application.cv) {
                application.cvUrl = `${baseUrl}${application.cv}`;
            }
        });

        // Count pending applications
        const pendingCount = await Application.countDocuments({ jobId, status: 'Pending' });

        return res.status(200).json({ applications, pendingCount });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


// controllers/applications.controller.js
export const getApplicationsForJob2 = async (req, res) => {
    const { jobId } = req.params;
    const { status } = req.query; // Get the status from the query parameter


    const query = { jobId };
    if (status) {
        query.status = status; // Make sure status matches the case in your database
    }


    try {
        const applications = await Application.find(query)
            .populate({
                path: 'userId',
                select: 'fullName email phoneNumber',
                model: 'User'
            })
            .lean();


        console.log('Fetched Applications:', applications); // Debugging


        if (applications.length === 0) {
            console.log('No applications found for jobId:', jobId, 'with status:', status);
        }


        const baseUrl = `${req.protocol}://${req.get('host')}`;
        applications.forEach(application => {
            if (application.coverLetter) {
                application.coverLetterUrl = `${baseUrl}${application.coverLetter}`;
            }
            if (application.cv) {
                application.cvUrl = `${baseUrl}${application.cv}`;
            }
        });


        return res.status(200).json(applications);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


let pendingApplicationsCount=0
export const getApplicationsForJob = async (req, res) => {
    const { jobId } = req.params;
    const { status = 'Pending' } = req.query; // Default status to 'Pending'

    const query = { jobId };
    if (status) {
        query.status = status; // Ensure status matches the case in your database
    }

    try {
        console.log('Query:', query); // Log the query for debugging

        const applications = await Application.find(query)
            .populate({
                path: 'userId',
                select: 'fullName email phoneNumber',
                model: 'User'
            })
            .lean();

        console.log('Fetched Applications:', applications); // Debugging

        if (applications.length === 0) {
            console.log('No applications found for jobId:', jobId, 'with status:', status);
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        applications.forEach(application => {
            if (application.coverLetter) {
                application.coverLetterUrl = `${baseUrl}${application.coverLetter}`;
            }
            if (application.cv) {
                application.cvUrl = `${baseUrl}${application.cv}`;
            }
        });

        // Update the pending applications count
        pendingApplicationsCount = applications.filter(app => app.status === 'Pending').length;

        return res.status(200).json({
            applications,
            pendingApplicationsCount // Send the pending applications count in the response
        });
    } catch (error) {
        console.error('Error fetching applications:', error); // Enhanced error logging
        return res.status(500).json({ message: 'Server error', error });
    }
};



//accept/reject
// Accept an application
// Simplify the acceptance function temporarily for debugging
// Accept an application
export const acceptApplication = async (req, res) => {
    const { applicationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'Invalid applicationId format' });
    }

    try {
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status: 'Accepted' },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        return res.status(200).json({ message: 'Application accepted', application });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Reject an application
export const rejectApplication = async (req, res) => {
    const { applicationId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'Invalid applicationId format' });
    }

    try {
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status: 'Rejected' },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        return res.status(200).json({ message: 'Application rejected', application });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};



// Get all accepted applications for jobs created by a specific company
// Get all accepted applications for a company
// Controller
export const getAcceptedApplications = async (req, res) => {
    const { companyId } = req.params;

    try {
        const applications = await Application.find({ companyId, status: 'Accepted' })
            .populate({
                path: 'jobId', // Assuming 'jobId' references the Job model
                select: 'jobTitle', // Select only the fields you need
                model: 'Job'
            })
            .populate({
                path: 'userId',
                select: 'fullName email phoneNumber',
                model: 'User'
            })
            .lean();

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        applications.forEach(application => {
            if (application.coverLetter) {
                application.coverLetterUrl = `${baseUrl}${application.coverLetter}`;
            }
            if (application.cv) {
                application.cvUrl = `${baseUrl}${application.cv}`;
            }
        });

        return res.status(200).json(applications);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


export const getRejectedApplications = async (req, res) => {
    const { companyId } = req.params;

    try {
        const applications = await Application.find({ companyId, status: 'Rejected' })
            .populate({
                path: 'jobId',
                select: 'jobTitle',
                model: 'Job'
            })
            .populate({
                path: 'userId',
                select: 'fullName email phoneNumber',
                model: 'User'
            })
            .lean();

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        applications.forEach(application => {
            if (application.coverLetter) {
                application.coverLetterUrl = `${baseUrl}${application.coverLetter}`;
            }
            if (application.cv) {
                application.cvUrl = `${baseUrl}${application.cv}`;
            }
        });

        return res.status(200).json(applications);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Delete an application (company side only)
export const deleteApplicationFromCompany1 = async (req, res) => {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'Invalid applicationId format' });
    }

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Only remove the application if it's not already processed or if it's in a rejected state
        if (application.status !== 'Rejected') {
            return res.status(403).json({ message: 'Only rejected applications can be deleted' });
        }

        await Application.findByIdAndUpdate(applicationId, { $set: { status: 'Deleted' } }); // Mark as deleted
        

        return res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteApplicationFromCompany = async (req, res) => {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'Invalid applicationId format' });
    }

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if the application status is already "Rejected" or not
        if (application.status !== 'Rejected') {
            return res.status(403).json({ message: 'Only rejected applications can be deleted' });
        }

        // Update the status to "Deleted" instead of removing the application
        const updatedApplication = await Application.findByIdAndUpdate(
            applicationId,
            { status: 'Deleted' }, // Update status to "Deleted"
            { new: true } // Return the updated document
        );

        return res.status(200).json({ message: 'Application deleted successfully', application: updatedApplication });
    } catch (error) {
        console.error('Error deleting application:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};

// controllers/applications.controller.js
export const getApplicationCountsForJob = async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: 'Invalid jobId format' });
    }

    try {
        // Count the total number of applications
        const totalCount = await Application.countDocuments({ jobId });

        return res.status(200).json({
            totalCount
        });
    } catch (error) {
        console.error('Error fetching application counts:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};


// Count the number of accepted applications for a specific job
export const getAcceptedApplicationsCountForJob = async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: 'Invalid jobId format' });
    }

    try {
        const acceptedCount = await Application.countDocuments({ jobId, status: 'Accepted' });
        return res.status(200).json({ acceptedCount });
    } catch (error) {
        console.error('Error counting accepted applications:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Count the number of rejected applications for a specific job
export const getRejectedApplicationsCountForJob = async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: 'Invalid jobId format' });
    }

    try {
        const rejectedCount = await Application.countDocuments({ jobId, status: 'Rejected' });
        return res.status(200).json({ rejectedCount });
    } catch (error) {
        console.error('Error counting rejected applications:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Check if a user has applied for a specific job
export const hasUserAppliedForJob = async (req, res) => {
    const { userId, jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: 'Invalid userId or jobId format' });
    }

    try {
        // Check if there is an application by this user for this job
        const application = await Application.findOne({ userId, jobId });

        // Return 'yes' if an application exists, otherwise 'no'
        if (application) {
            return res.status(200).json({ hasApplied: 'yes' });
        } else {
            return res.status(200).json({ hasApplied: 'no' });
        }
    } catch (error) {
        console.error('Error checking application status:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};


// New function to update application status to 'Deletedby'
export const deleteApplicationFromJobseeker = async (req, res) => {
    const { applicationId } = req.params;
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        return res.status(400).json({ message: 'Invalid applicationId format' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid userId format' });
    }

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this application' });
        }

        // Update the application status to 'Deletedby'
        application.status = 'Deletedby';
        await application.save();

        return res.status(200).json({ message: 'Application status updated to Deletedby' });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const getApplicants = async (req, res) => {
    try {
      const { companyId } = req.params;
      const applications = await Application.find({ companyId })
        .select('fullName email phoneNumber cv')  // Only fetch the required fields
        .sort({ createdAt: -1 });  // Sort by the most recent application
      res.status(200).json(applications);
    } catch (error) {
      console.error('Error fetching applicants:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
