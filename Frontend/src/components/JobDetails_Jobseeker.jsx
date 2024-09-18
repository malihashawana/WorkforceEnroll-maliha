import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@mui/material'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function JobDetails_Jobseeker() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingCounts, setPendingCounts] = useState(0); // Store pending counts
  const [applicationCounts, setApplicationCounts] = useState(0); // Store total application counts

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
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="p-6 bg-gradient-to-r from-purple-100 to-orange-200 min-h-screen dark:text-slate-900 dark:bg-gradient-to-r dark:from-gray-500 dark:to-slate-700 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-gradient-to-r from-yellow-50 to-blue-200 p-4 rounded-md shadow-md dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-700 dark:text-slate-200">
      <div className="border border-gray-400 dark:border-gray-800 p-4 rounded-md">
        <p className="absolute top-2 right-2">
          <Link to="/applications" className='btn btn-sm btn-circle btn-ghost hover:bg-gray-100 dark:bg-slate-500 dark:hover:bg-slate-600'>
            <ArrowBackIcon />
          </Link>
        </p>
        {job ? (
          <>
            <h2 className="text-2xl font-bold mb-4 border border-pink-300 dark:border-slate-400">{job.jobTitle}</h2>
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
            <div className="flex justify-end mt-4">
              
            </div>
          </>
        ) : (
          <p>Job not found.</p>
        )}
      </div>
    </div>
    </div>
  );
}

export default JobDetails_Jobseeker;
