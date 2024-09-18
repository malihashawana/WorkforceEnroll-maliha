import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  //
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
},
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  expectedSalary: {
    type: Number,
    required: true,
  },
  currentJobTitle: {
    type: String,
    required: true,
  },
  currentJobEmployer: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,  // Store the path or URL to the cover letter file
    required: false,
  },
  cv: {
    type: String,  // Store the path or URL to the CV file
    required: true, // Ensure CV is always required
  },
  coverLetterOriginalName: {
    type: String,  // Store the original filename of the cover letter
    required: false,
},
cvOriginalName: {
    type: String,  // Store the original filename of the CV
    required: true,
},
  
  termsAccepted: {
    type: Boolean,
    required: true,
  },
  //accept/reject
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected','Deleted','Deletedby'],
    default: 'Pending'
},

}, {
  timestamps: true,
});
// Index to ensure a user cannot apply to the same job more than once
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });


const Application = mongoose.model("Application", applicationSchema);
export default Application;