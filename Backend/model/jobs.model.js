import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  workMode: {
    type: String,
    required: true,
    enum: ["on-site", "remote", "hybrid"],
  },
  jobType: {
    type: String,
    required: true,
    enum: ["full-time", "part-time", "contract", "internship", "freelance"],
  },
  jobCategory: {
    type: String,
    required: true,
    enum: ["it", "marketing", "sales", "finance", "hr"],
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ["entry-level", "mid-level", "senior-level", "manager", "director"],
  },
  deadline: {
    type: Date,
    required: true,
  },
  minSalary: {
    type: Number,
    required: true,
  },
  maxSalary: {
    type: Number,
    required: true,
  },
  negotiable: {
    type: Boolean,
    default: false,
  },
  responsibilities: {
    type: String,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  preferredQualifications: {
    type: String,
  },
  benefits: {
    type: String,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User1',
    //ref: 'Company',
    required: true,
  },
  //
  bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  //bookmarkedByCompany: [{type: mongoose.Schema.Types.ObjectId,ref: 'User1'}]
  bookmarkedByCompany: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});


const Job = mongoose.model("Job", jobSchema);
export default Job;
