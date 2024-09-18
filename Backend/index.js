import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


import bookRouter from './route/book.route.js';
import userRouter from './route/user.route.js';
import user1Router from './route/company.route.js';
import user2Router from './route/admin1.route.js';
import jobsRouter from './route/jobs.route.js';
import applicationsRouter from './route/applications.route.js';


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


// Ensure the uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}


// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
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


// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir, {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
    }
  }
}));


// Use the multer middleware directly in the applications route
app.use('/book', bookRouter);
app.use('/user', userRouter);
app.use('/user1', user1Router);
app.use('/user2', user2Router);
app.use('/jobs', jobsRouter);
app.use('/applications', applicationsRouter);


// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: 'An error occurred: ' + err.message });
  }
  next();
});


const PORT = process.env.PORT || 4000;
const URI = process.env.MongoBDURI;


mongoose.connect(URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
