import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@mui/material'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function Pending_Applications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobTitle, setJobTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationsAndJobTitle = async () => {
      try {
          const responseApplications = await fetch(`http://localhost:4001/applications/job/${jobId}?status=Pending`);
          const data = await responseApplications.json();
          console.log('Applications data:', data); // Debugging
          if (responseApplications.ok) {
              setApplications(data.applications);
          } else {
              setError('Failed to fetch applications');
          }
  
          const responseJob = await fetch(`http://localhost:4001/jobs/${jobId}`);
          const jobData = await responseJob.json();
          console.log('Job data:', jobData); // Debugging
          if (responseJob.ok) {
              setJobTitle(jobData.jobTitle);
          } else {
              setError('Failed to fetch job details');
          }
      } catch (error) {
          setError('Error fetching data');
          console.error('Error:', error);
      } finally {
          setLoading(false);
      }
  };
  
    
    fetchApplicationsAndJobTitle();
  }, [jobId]);

  const handleAccept = async (applicationId) => {
    try {
        const response = await fetch(`http://localhost:4001/applications/${applicationId}/accept`, {
            method: 'PUT',
        });
        if (response.ok) {
            setApplications(prevApplications => prevApplications.filter(app => app._id !== applicationId));
        } else {
            setError('Failed to accept application');
        }
    } catch (error) {
        setError('Error accepting application');
    }
};

const handleReject = async (applicationId) => {
    try {
        const response = await fetch(`http://localhost:4001/applications/${applicationId}/reject`, {
            method: 'PUT',
        });
        if (response.ok) {
            setApplications(prevApplications => prevApplications.filter(app => app._id !== applicationId));
        } else {
            setError('Failed to reject application');
        }
    } catch (error) {
        setError('Error rejecting application');
    }
};

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <span className="text-xl">Loading...</span>
    </div>
  );

  if (error) return <p className="text-red-600">{error}</p>;

  console.log('Applications length:', applications.length);

  return (
    <div className="p-6 bg-blue-200 min-h-screen dark:text-slate-200 dark:bg-slate-800">
      <p>
        <Link to="/created_jobs" className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-gray-100 dark:hover:bg-slate-600'>✕</Link>
      </p>
      <h2 className="text-2xl font-bold mb-6">
        Applications for{' '}
        <Link to={`/job-details/${jobId}`} className="text-blue-600 underline">
          {jobTitle}
        </Link>
      </h2>
      
      {applications.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {applications.map((application) => (
            <div key={application._id} className="bg-yellow-50 p-6 rounded-md shadow-md dark:bg-slate-300 dark:text-black">
              <h3 className="text-xl font-semibold mb-2">
                Applicant: {application.fullName}
              </h3>
              <p><strong>Email:</strong> {application.email}</p>
              <p><strong>Phone:</strong> {application.phoneNumber}</p>
              <p><strong>Expected Salary:</strong> BDT {application.expectedSalary}</p>
              <p><strong>Most Recent Job:</strong> {application.currentJobTitle} at {application.currentJobEmployer}</p>
              <p><strong>Cover Letter:</strong> 
                {application.coverLetter ? (
                  <a href={`http://localhost:4001${application.coverLetter}`} target="_blank" rel="noopener noreferrer">View Cover Letter</a>
                ) : 'N/A'}
              </p>
              <p><strong>CV:</strong> 
                {application.cv ? (
                  <a href={`http://localhost:4001${application.cv}`} target="_blank" rel="noopener noreferrer">View CV</a>
                ) : 'N/A'}
              </p>
              <div className="flex justify-between mt-4">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleAccept(application._id)}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => handleReject(application._id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No pending applications here.</p>
      )}
    </div>
  );
}

export default Pending_Applications;
