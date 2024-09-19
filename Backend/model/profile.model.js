import mongoose from "mongoose";


const profileSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  bloodGroup: {
    type: String,
    trim: true
  },
  religion: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  institution: {
    type: String,
    trim: true
  },
  sscOlevel: {
    type: String,
    trim: true
  },
  hscAlevel: {
    type: String,
    trim: true
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  image: {
    type: String,
    trim: true
  }
}, { timestamps: true });


const Profile = mongoose.model("Profile", profileSchema);


export default Profile;
