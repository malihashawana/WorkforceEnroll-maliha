import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useNavigate } from 'react-router-dom';



function Created_Jobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [bookmarkedJobs, setBookmarkedJobs] = useState(new Set());
  const [pendingCounts, setPendingCounts] = useState({}); // Store pending counts
  const [applicationCounts, setApplicationCounts] = useState({}); // Store total application counts
  const [acceptedCounts, setAcceptedCounts] = useState({});
  const [rejectedCounts, setRejectedCounts] = useState({});


  useEffect(() => {
    const fetchJobs = async () => {
      const user = JSON.parse(localStorage.getItem('Users'));
      if (user && user.user1) {
        const companyId = user.user1._id;
        try {
          // Fetch jobs for the company
          const response = await fetch(`http://localhost:4001/jobs?company=${companyId}`);
          if (response.ok) {
            const data = await response.json();
            setJobs(data);


            // Extract bookmarked job IDs from fetched jobs
            const bookmarks = new Set(data.filter(job => job.bookmarkedByCompany).map(job => job._id));
            setBookmarkedJobs(bookmarks);


            // Fetch pending application counts
            const counts = await fetchPendingCounts(data.map(job => job._id));
            setPendingCounts(counts);


            // Fetch total application counts
            const appCounts = await fetchApplicationCounts(data.map(job => job._id));
            setApplicationCounts(appCounts);


            const acceptedAndRejectedCounts = await fetchAcceptedAndRejectedCounts(data.map(job => job._id));
            setAcceptedCounts(acceptedAndRejectedCounts.accepted);
            setRejectedCounts(acceptedAndRejectedCounts.rejected);
          } else {
            console.error('Failed to fetch jobs');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };


    const fetchPendingCounts = async (jobIds) => {
      const counts = {};
      for (const jobId of jobIds) {
        try {
          const response = await fetch(`http://localhost:4001/applications/job/${jobId}?status=Pending`);
          if (response.ok) {
            const data = await response.json();
            counts[jobId] = data.applications.length;
          } else {
            counts[jobId] = 0;
          }
        } catch (error) {
          counts[jobId] = 0;
        }
      }
      return counts;
    };
   
    const fetchAcceptedAndRejectedCounts = async (jobIds) => {
      const counts = {
        accepted: {},
        rejected: {},
      };
   
      for (const jobId of jobIds) {
        try {
          const [acceptedResponse, rejectedResponse] = await Promise.all([
            fetch(`http://localhost:4001/applications/jobs/${jobId}/accepted-count`),
            fetch(`http://localhost:4001/applications/jobs/${jobId}/rejected-count`)
          ]);
   
          if (acceptedResponse.ok) {
            const acceptedData = await acceptedResponse.json();
            counts.accepted[jobId] = acceptedData.acceptedCount;
          } else {
            counts.accepted[jobId] = 0;
          }
   
          if (rejectedResponse.ok) {
            const rejectedData = await rejectedResponse.json();
            counts.rejected[jobId] = rejectedData.rejectedCount;
          } else {
            counts.rejected[jobId] = 0;
          }
        } catch (error) {
          counts.accepted[jobId] = 0;
          counts.rejected[jobId] = 0;
        }
      }
   
      return counts;
    };
   




    const fetchApplicationCounts = async (jobIds) => {
      const counts = {};
      for (const jobId of jobIds) {
        try {
          const response = await fetch(`http://localhost:4001/applications/job/${jobId}/counts`);
          if (response.ok) {
            const data = await response.json();
            counts[jobId] = data.totalCount;
          } else {
            counts[jobId] = 0;
          }
        } catch (error) {
          counts[jobId] = 0;
        }
      }
      return counts;
    };


    fetchJobs();
  }, []);


  const handleDeleteClick = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:4001/jobs/${jobId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setJobs(jobs.filter((job) => job._id !== jobId));
      } else {
        console.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleBookmarkClick = async (jobId) => {
    try {
      const response = await fetch('http://localhost:4001/jobs/bookmark/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });


      if (response.ok) {
        const data = await response.json();
        setBookmarkedJobs(prev => {
          const newSet = new Set(prev);
          if (newSet.has(jobId)) {
            newSet.delete(jobId);
          } else {
            newSet.add(jobId);
          }
          return newSet;
        });
      } else {
        console.error('Failed to toggle bookmark status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  {/*const formatDate = (dateString) => {
        if (!dateString) {
            return "N/A";
        }
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    const formatDate = (dateString) => {
      if (!dateString) {
          return "N/A";
      }
  
      const date = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      
      // Reset hours for today and tomorrow
      today.setHours(0, 0, 0, 0);
      tomorrow.setDate(today.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
  
      console.log(`Date: ${date.toISOString().split('T')[0]}, Today: ${today.toISOString().split('T')[0]}, Tomorrow: ${tomorrow.toISOString().split('T')[0]}`); // Debugging line
  
      if (date.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
          return "Today is the deadline";
      }
  
      if (date.toISOString().split('T')[0] === tomorrow.toISOString().split('T')[0]) {
          //return date.toISOString().split('T')[0];
          return "Tomorrow is the deadline";
      }
  
      return date.toISOString().split('T')[0];
  };*/}
  const formatDate = (dateString) => {
    if (!dateString) {
        return "N/A";
    }

    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    
    // Reset hours for today and tomorrow
    today.setHours(0, 0, 0, 0);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const formattedDate = date.toISOString().split('T')[0];

    console.log(`Date: ${formattedDate}, Today: ${today.toISOString().split('T')[0]}, Tomorrow: ${tomorrow.toISOString().split('T')[0]}`); // Debugging line

    if (formattedDate === today.toISOString().split('T')[0]) {
        return `Today is the deadline (${formattedDate})`;
    }

    if (formattedDate === tomorrow.toISOString().split('T')[0]) {
        return `Tomorrow is the deadline (${formattedDate})`;
    }

    return formattedDate;
};

  


  return (
    <div className="min-h-screen bg-blue-200 dark:text-slate-200 dark:bg-slate-800">
      {/* Navbar */}
<div className="fixed top-0 left-0 right-0 bg-blue-200 dark:bg-slate-800 p-6 z-10 flex items-center shadow-md">
  
  {/* Back Button */}
  <Link to="/company_dashboard">
    <IconButton size="small" className="hover:bg-gray-100 dark:hover:bg-slate-600 dark:bg-slate-500">
      <ArrowBackIcon />
    </IconButton>
  </Link>
  
  {/* Centered Title */}
  <h2 className="text-2xl font-bold absolute left-1/2 transform -translate-x-1/2">
    Created Jobs
  </h2>
  
  {/* Add Jobs Button */}
  <button
    onClick={() => navigate('/addjobs')}
    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 absolute right-4"
  >
    Add
  </button>
  
</div>

      {/* Main Content */}
      <div className="pt-24 p-6"> {/* Add padding-top to account for the fixed navbar */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div key={index} className="relative bg-yellow-50 p-6 rounded-md shadow-md dark:bg-slate-300 dark:text-black">
                {/* Bookmark icon positioned in the top-right corner */}
                <div className="absolute top-6 right-4">
                  <IconButton onClick={() => handleBookmarkClick(job._id)} style={{ fontSize: 30 }}>
                    {bookmarkedJobs.has(job._id) ? <BookmarkIcon fontSize="large"/> : <BookmarkBorderIcon fontSize="large"/>}
                  </IconButton>
                </div>


                <div className="border-b-2 border-gray-800 dark:border-gray-200 mb-4 pb-2">
                  <div className="border-2 border-gray-600 dark:border-gray-400 p-2 rounded-md">
                    <h3 className="text-xl font-semibold mb-2">{job.jobTitle}</h3>
                  </div>
                </div>
                <div className="border border-gray-800 dark:border-gray-200 p-4 rounded-md mb-4">
                  <p><strong>Company:</strong> {job.companyName}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Work Mode:</strong> {job.workMode}</p>
                  <p><strong>Job Type:</strong> {job.jobType}</p>
                  <p><strong>Category:</strong> {job.jobCategory}</p>
                  <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
                  <p>
                    <strong>Salary Range:</strong> BDT:{job.minSalary} - {job.maxSalary}{' '}
                    {job.negotiable ? '(Negotiable)' : ''}
                  </p>
                  <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
                  <p><strong>Requirements:</strong> {job.requirements}</p>
                  <p><strong>Preferred Qualifications:</strong> {job.preferredQualifications}</p>
                  <p><strong>Benefits:</strong> {job.benefits}</p>
                  <p><strong>Posted:</strong> {formatDate(job.createdAt)}</p>
                  <p><strong>Deadline:</strong> {formatDate(job.deadline)}</p>
                  <p><strong>Applications Count:</strong> {applicationCounts[job._id] || 0}</p> {/* New field */}
                  <p><strong>Accepted Applications:</strong> {acceptedCounts[job._id] || 0}</p>
                  <p><strong>Rejected Applications:</strong> {rejectedCounts[job._id] || 0}</p>
                  <p><strong>Pending Applications:</strong> {pendingCounts[job._id] || 0}</p>


                 
                  <div className="flex justify-end items-center mt-4">
                    <div className="flex items-center">
                      <Link to={`/edit-job/${job._id}`}>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton onClick={() => handleDeleteClick(job._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end relative">
                <Link to={`/applications/${job._id}/pending`}>
                    <Button variant="contained" color="primary" className="relative">
                      Applications
                      <span className="absolute -top-2 -right-2 bg-pink-400 dark:bg-purple-600 text-white text-xs font-bold rounded-full px-2 py-1">
                        {pendingCounts[job._id] || 0}
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}


export default Created_Jobs;