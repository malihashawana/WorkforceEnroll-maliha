import mongoose from 'mongoose';
import Job from "../model/jobs.model.js";


// adding new
export const addJob = async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      location,
      workMode,
      jobType,
      jobCategory,
      experienceLevel,
      minSalary,
      maxSalary,
      negotiable,
      responsibilities,
      requirements,
      preferredQualifications,
      benefits,
      company,
      deadline
    } = req.body;


    // Checking if the company is provided
    if (!company) {
      return res.status(400).json({ message: "Company ID is required" });
    }


    // Check
    const existingJob = await Job.findOne({ jobTitle, companyName });
    if (existingJob) {
      return res.status(400).json({ message: "This job already exists" });
    }


    // Creating new job (company)
    const newJob = new Job({
      jobTitle,
      companyName,
      location,
      workMode,
      jobType,
      jobCategory,
      experienceLevel,
      minSalary,
      maxSalary,
      negotiable,
      responsibilities,
      requirements,
      preferredQualifications,
      benefits,
      company,
      deadline
    });


    const savedJob = await newJob.save();
    res.status(201).json({ message: "Job created successfully", job: savedJob });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Fetch all jobs with bookmark status for a user
export const getAllJobs = async (req, res) => {
  try {
    const currentDate = new Date();
    const userId = req.query.userId; // Get userId from query params if available


    const jobs = await Job.find({ deadline: { $gte: currentDate } });


    if (userId) {
      const jobsWithBookmarkStatus = jobs.map(job => ({
        ...job.toObject(),
        isBookmarked: job.bookmarkedBy.includes(userId)
      }));


      res.status(200).json(jobsWithBookmarkStatus);
    } else {
      res.status(200).json(jobs);
    }
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};





// Toggle bookmark status for a company
export const toggleBookmarkCompany = async (req, res) => {
  try {
    const { jobId } = req.body; // Expect jobId in the request body


    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID format" });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }


    // Toggle the bookmark status
    job.bookmarkedByCompany = !job.bookmarkedByCompany;
    await job.save();


    res.status(200).json({ bookmarkedByCompany: job.bookmarkedByCompany });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Fetch jobs for a company and optionally toggle bookmark status
export const getJobsByCompany = async (req, res) => {
  try {
    const { company, toggleJobId } = req.query; // Use company to fetch jobs, toggleJobId to toggle bookmark status


    if (!company) {
      return res.status(400).json({ message: "Company ID is required" });
    }


    // Toggle bookmark status if toggleJobId is provided
    if (toggleJobId) {
      if (!mongoose.Types.ObjectId.isValid(toggleJobId)) {
        return res.status(400).json({ message: "Invalid Job ID format" });
      }


      const job = await Job.findById(toggleJobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }


      // Toggle the bookmark status
      job.bookmarkedByCompany = !job.bookmarkedByCompany;
      await job.save();


      // Respond with the updated bookmark status
      return res.status(200).json({ bookmarkedByCompany: job.bookmarkedByCompany });
    }


    // Fetch all jobs for the given company
    const jobs = await Job.find({ company });


    res.status(200).json(jobs);
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Fetch bookmarked jobs for a company
export const getBookmarkedJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params; // Get companyId from route params

    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid Company ID format" });
    }

    // Fetch all jobs for the given company that are bookmarked
    const jobs = await Job.find({
      company: companyId,
      bookmarkedByCompany: true
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};







//fetching a single job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json(job);
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Edit
export const updateJob = async (req, res) => {
  try {
    const {
      jobTitle,
      companyName,
      location,
      workMode,
      jobType,
      jobCategory,
      experienceLevel,
      minSalary,
      maxSalary,
      negotiable,
      responsibilities,
      requirements,
      preferredQualifications,
      benefits,
      deadline,
    } = req.body;


    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }


    const duplicateJob = await Job.findOne({
      _id: { $ne: id },
      jobTitle,
      companyName,
    });


    if (duplicateJob) {
      return res.status(400).json({ message: "This job already exists" });
    }


    job.jobTitle = jobTitle;
    job.companyName = companyName;
    job.location = location;
    job.workMode = workMode;
    job.jobType = jobType;
    job.jobCategory = jobCategory;
    job.experienceLevel = experienceLevel;
    job.minSalary = minSalary;
    job.maxSalary = maxSalary;
    job.negotiable = negotiable;
    job.responsibilities = responsibilities;
    job.requirements = requirements;
    job.preferredQualifications = preferredQualifications;
    job.benefits = benefits;
    job.deadline=deadline;


    const updatedJob = await job.save();
    res.status(200).json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


//delete
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }


    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Toggle bookmark status for a job
export const toggleBookmark = async (req, res) => {
  try {
    const { userId, jobId } = req.body;


    // Validate input
    if (!userId || !jobId) {
      return res.status(400).json({ message: "User ID and Job ID are required" });
    }


    // Check if userId and jobId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid User ID or Job ID format" });
    }


    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }


    // Check if the job is already bookmarked by the user
    const isBookmarked = job.bookmarkedBy.includes(userId);


    if (isBookmarked) {
      // Remove the bookmark
      job.bookmarkedBy.pull(userId);
    } else {
      // Add the bookmark
      job.bookmarkedBy.push(userId);
    }


    // Save the updated job
    await job.save();


    res.status(200).json({ message: isBookmarked ? "Bookmark removed" : "Job bookmarked" });
  } catch (error) {
    console.log("Error: " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};




// controllers/jobs.controller.js
// In your backend controller (e.g., `jobs.controller.js`)
export const getBookmarkedJobs = async (req, res) => {
  try {
    const userId = req.params.userId;


    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }


    // Replace with your actual data fetching logic
    const jobs = await Job.find({ bookmarkedBy: userId });


    if (!jobs.length) {
      return res.status(404).json({ message: "No bookmarked jobs found" });
    }


    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching bookmarked jobs:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const startIdx = (page - 1) * limit;
    const searchTerm = req.query.searchTerm || "";

    const searchQuery = {
      $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { companyName: { $regex: searchTerm, $options: "i" } },
          { jobTitle: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } }
        ]
      };      


    const results = await Job.find(searchQuery)
      .limit(limit)
      .skip(startIdx);


    if (results.length === 0) {
      return res.status(404).json({ message: 'No jobs found' });
    }

    res.status(200).json(results);


  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while searching for jobs' });
  }
};
