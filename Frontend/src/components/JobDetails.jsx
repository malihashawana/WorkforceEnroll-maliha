import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@mui/material'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingCounts, setPendingCounts] = useState(0); // Store pending counts
  const [applicationCounts, setApplicationCounts] = useState(0); // Store total application counts
  const [acceptedCounts, setAcceptedCounts] = useState(0);
  const [rejectedCounts, setRejectedCounts] = useState(0);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:4001/jobs/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setJob(data);

          // Fetch pending application counts
          const pendingCount = await fetchPendingCounts(jobId);
          setPendingCounts(pendingCount);

          // Fetch total application counts
          const appCount = await fetchApplicationCounts(jobId);
          setApplicationCounts(appCount);

          // Fetch accepted and rejected counts
          const acceptedAndRejectedCounts = await fetchAcceptedAndRejectedCounts(data._id);
          setAcceptedCounts(acceptedAndRejectedCounts.accepted);
          setRejectedCounts(acceptedAndRejectedCounts.rejected);

        } else {
          setError('Failed to fetch job details');
        }
      } catch (error) {
        setError('Error fetching job details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPendingCounts = async (jobId) => {
      try {
        const response = await fetch(`http://localhost:4001/applications/job/${jobId}?status=Pending`);
        if (response.ok) {
          const data = await response.json();
          return data.applications.length;
        } else {
          return 0;
        }
      } catch (error) {
        console.error('Error fetching pending counts:', error);
        return 0;
      }
    };
    
    const fetchAcceptedAndRejectedCounts = async (jobId) => {
      const counts = {
        accepted: 0,
        rejected: 0,
      };
   
      try {
        const [acceptedResponse, rejectedResponse] = await Promise.all([
          fetch(`http://localhost:4001/applications/jobs/${jobId}/accepted-count`),
          fetch(`http://localhost:4001/applications/jobs/${jobId}/rejected-count`)
        ]);
   
        if (acceptedResponse.ok) {
          const acceptedData = await acceptedResponse.json();
          counts.accepted = acceptedData.acceptedCount;
        }
   
        if (rejectedResponse.ok) {
          const rejectedData = await rejectedResponse.json();
          counts.rejected = rejectedData.rejectedCount;
        }
      } catch (error) {
        console.error('Error fetching accepted and rejected counts:', error);
      }
   
      return counts;
    };

    const fetchApplicationCounts = async (jobId) => {
      try {
        const response = await fetch(`http://localhost:4001/applications/job/${jobId}/counts`);
        if (response.ok) {
          const data = await response.json();
          return data.totalCount;
        } else {
          return 0;
        }
      } catch (error) {
        console.error('Error fetching application counts:', error);
        return 0;
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <span className="text-xl">Loading...</span>
    </div>
  );

  if (error) return <p className="text-red-600">{error}</p>;

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

    if (date.toISOString().split('T')[0] === today.toISOString().split('T')[0]) {
        return `Today is the deadline (${date.toISOString().split('T')[0]})`;
    }

    if (date.toISOString().split('T')[0] === tomorrow.toISOString().split('T')[0]) {
        return `Tomorrow is the deadline (${date.toISOString().split('T')[0]})`;
    }

    return date.toISOString().split('T')[0];
  };

  return (
    <div className="p-6 bg-blue-200 min-h-screen dark:text-slate-200 dark:bg-slate-800 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-yellow-50 p-4 rounded-md shadow-md dark:bg-slate-300 dark:text-black">
        <p className="absolute top-2 right-2">
          <Link to="/created_jobs" className='btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:hover:bg-slate-600'>
            <ArrowBackIcon />
          </Link>
        </p>
        {job ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{job.jobTitle}</h2>
            <p><strong>Company:</strong> {job.companyName}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Work Mode:</strong> {job.workMode}</p>
            <p><strong>Job Type:</strong> {job.jobType}</p>
            <p><strong>Category:</strong> {job.jobCategory}</p>
            <p><strong>Experience Level:</strong> {job.experienceLevel}</p>
            <p>
              <strong>Salary Range:</strong> BDT {job.minSalary} - {job.maxSalary} 
              {job.negotiable ? ' (Negotiable)' : ''}
            </p>
            <p><strong>Responsibilities:</strong> {job.responsibilities}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
            <p><strong>Preferred Qualifications:</strong> {job.preferredQualifications}</p>
            <p><strong>Benefits:</strong> {job.benefits}</p>
            <p><strong>Posted:</strong> {formatDate(job.createdAt)}</p>
            <p><strong>Deadline:</strong> {formatDate(job.deadline)}</p>
            <p><strong>Applications Count:</strong> {applicationCounts || 0}</p>
            <p><strong>Accepted Applications:</strong> {acceptedCounts || 0}</p>
            <p><strong>Rejected Applications:</strong> {rejectedCounts || 0}</p>
            <div className="flex justify-end mt-4">
              <Link to={`/applications/${job._id}/pending`}>
                <Button variant="contained" color="primary" className="relative">  
                    View Applications
                    <span className="absolute -top-2 -right-2 bg-pink-400 dark:bg-purple-600 text-white text-xs font-bold rounded-full px-2 py-1">
                      {pendingCounts}
                    </span>
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <p>Job not found.</p>
        )}
      </div>
    </div>
  );
}

export default JobDetails;
