import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Company_Bookmarked_Jobs() {
  const [jobs, setJobs] = useState([]);
  const [pendingCounts, setPendingCounts] = useState({}); // Store pending counts

  useEffect(() => {
    const fetchBookmarkedJobs = async () => {
      const user = JSON.parse(localStorage.getItem('Users'));
      if (user && user.user1) {
        const companyId = user.user1._id;
        try {
          const response = await fetch(`http://localhost:4001/jobs/bookmarked-jobs/${companyId}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Fetched bookmarked jobs:', data);
            setJobs(data);

            // Fetch pending application counts
            const counts = await fetchPendingCounts(data.map(job => job._id));
            setPendingCounts(counts);
          } else {
            console.error('Failed to fetch bookmarked jobs');
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

    fetchBookmarkedJobs();
  }, []);

  const handleToggleBookmark = async (jobId) => {
    try {
      const response = await fetch('http://localhost:4001/jobs/bookmark/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      if (response.ok) {
        // Remove the job from the state if unbookmarked
        setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      } else {
        console.error('Failed to toggle bookmark status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  {/*const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
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
      <div className="fixed top-0 left-0 right-0 bg-blue-200 dark:bg-slate-800 p-6 z-10 flex justify-between items-center shadow-md">
        <Link to="/company_dashboard">
          <IconButton size="small" className="hover:bg-gray-100 dark:hover:bg-slate-600 dark:bg-slate-500">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <h2 className="text-2xl font-bold">Bookmarked Jobs</h2>
        <div></div> {/* Empty div to balance the layout */}
      </div>
      {/* Main Content */}
      <div className="pt-24 p-6"> {/* Add padding-top to account for the fixed navbar */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div key={index} className="relative bg-yellow-50 p-6 rounded-md shadow-md dark:bg-slate-300 dark:text-black">
                <div className="border-b-2 border-gray-800 dark:border-gray-200 mb-4 pb-2">
                  <div className="border-2 border-gray-600 dark:border-gray-400 p-2 rounded-md flex justify-between items-center">
                    <h3 className="text-xl font-semibold mb-2">{job.jobTitle}</h3>
                    <div className="flex items-center">
                      <IconButton
                        onClick={() => handleToggleBookmark(job._id)}
                        className="hover:bg-gray-200 dark:hover:bg-slate-400 dark:bg-slate-300"
                      >
                        {job.bookmarkedByCompany ? <BookmarkIcon fontSize="large"/> : <BookmarkBorderIcon />}
                      </IconButton>
                      
                    </div>
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
                  <div className="flex justify-end mt-4">
                    <Link to={`/applications/${job._id}/pending`}>
                      <Button variant="contained" color="primary" className="relative">
                        Applications
                        <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full px-2 py-1">
                          {pendingCounts[job._id] || 0}
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              
            ))
          ) : (
            <p>No bookmarked jobs available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Company_Bookmarked_Jobs;
