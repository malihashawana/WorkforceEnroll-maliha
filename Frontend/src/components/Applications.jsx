import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusVisibility, setStatusVisibility] = useState({}); // State for managing status visibility
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchApplications = async () => {
      const user = JSON.parse(localStorage.getItem('Users'));

      if (user && user._id) {
        const userId = user._id;
        try {
          const response = await fetch(`http://localhost:4001/applications/${userId}`);

          if (response.ok) {
            const data = await response.json();
            if (data.length === 0) {
              setError('No applications found. You haven\'t applied for any jobs yet.');
            } else {
              // Filter out applications with status 'Deletedby'
              setApplications(data.filter(application => application.status !== 'Deletedby'));
            }
          } else {
            setError('Failed to fetch applications');
          }
        } catch (error) {
          setError('Error fetching applications');
        } finally {
          setLoading(false);
        }
      } else {
        setError('User not found');
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDeleteClick = async (applicationId) => {
    const user = JSON.parse(localStorage.getItem('Users'));

    if (user && user._id) {
        const userId = user._id;
        try {
            const response = await fetch(`http://localhost:4001/applications/jobseeker/${applicationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }), // Include userId in the request body
            });

            if (response.ok) {
                // Remove the application from the UI
                setApplications(applications.filter(application => application._id !== applicationId));
            } else {
                console.error('Failed to update application status');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
  };

  const handleEditClick = (application) => {
    navigate(`/edit-application/${application._id}`, { state: { application } });
  };

  const formatDate = (dateString) => {
    if (!dateString) {
        return "N/A";
    }
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Function to toggle visibility of the status message
  const toggleStatusVisibility = (id) => {
    setStatusVisibility(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-300 dark:text-slate-200 dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-900">
      <div className="fixed top-0 left-0 right-0 bg-blue-200 dark:bg-slate-800 p-6 z-10 flex justify-between items-center shadow-md">
        <Link to="/jobseeker_dashboard">
          <IconButton size="small" className="hover:bg-gray-100 dark:hover:bg-slate-600 dark:bg-slate-400">
            <ArrowBackIcon />
          </IconButton>
        </Link>
        <h2 className="text-2xl font-bold">My Applications</h2>
        <div></div> {/* Empty div to balance the layout */}
      </div>
      {/* Main Content */}
      <div className="pt-24 p-6"> {/* Added padding-top to account for the fixed navbar */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-xl">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-red-600">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <div key={application._id} className="border border-gray-300 dark:border-gray-800 bg-gradient-to-r from-yellow-50 to-blue-200 hover:from-pink-100 hover:to-orange-200 p-6 rounded-md shadow-md dark:text-black dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-600">
                <div className="border border-gray-400 dark:border-gray-800 p-4 rounded-md">
                  <h3 className="text-xl font-semibold mb-2 border-2 border-gray-400 dark:border-gray-700">
                    
                    {application.jobId ? (
                      <>
                        Applied for{' '}
                        <Tooltip title="Job details">
                        <Link to={`/job-details-jobseeker/${application.jobId._id}`} className="text-blue-500 hover:text-blue-700 dark:text-purple-900 dark:hover:text-purple-800 ">
                          {application.jobId.jobTitle}
                        </Link>{' '}
                        </Tooltip>
                        at {application.jobId.companyName}
                      </>
                      
                    ) : (
                      <span className="text-red-600 dark:text-red-800">This job is not available anymore</span>
                    )}
                    
                  </h3>
                  <p><strong>Full Name:</strong> {application.fullName}</p>
                  <p><strong>Email:</strong> {application.email}</p>
                  <p><strong>Phone Number:</strong> {application.phoneNumber}</p>
                  <p><strong>Expected Salary:</strong> BDT {application.expectedSalary}</p>
                  <p><strong>Most Recent Job Title:</strong> {application.currentJobTitle}</p>
                  <p><strong>Most Recent Job Employer:</strong> {application.currentJobEmployer}</p>
                  <p><strong>Cover Letter:</strong> 
                    {application.coverLetter ? (
                      <a href={`http://localhost:4001${application.coverLetter}`} target="_blank" rel="noopener noreferrer">View Cover Letter</a>
                    ) : (
                      'No cover letter provided'
                    )}
                  </p>
                  <p><strong>CV:</strong> 
                    {application.cv ? (
                      <a href={`http://localhost:4001${application.cv}`} target="_blank" rel="noopener noreferrer">View CV</a>
                    ) : 'No CV provided'}
                  </p>
                  <p><strong>Applied on:</strong> {formatDate(application.createdAt)}</p>
                  <p>
                    <strong>
                      <Tooltip title="Your application status" >
                    <button 
                      onClick={() => toggleStatusVisibility(application._id)} 
                      className={`px-2 py-1 rounded ${application.status === 'Accepted' && 'bg-gradient-to-r from-pink-100 to-pink-200 hover:from-teal-300 hover:to-blue-500 dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-900 dark:hover:from-teal-800 dark:hover:to-blue-900 dark:text-slate-300'} 
                  ${application.status === 'Rejected' && 'bg-gradient-to-r from-pink-100 to-pink-200 hover:from-pink-300 hover:to-red-700 dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-900 dark:hover:from-pink-900 dark:hover:to-red-950 dark:text-slate-300'} 
                  ${application.status === 'Pending' && 'bg-gradient-to-r from-pink-100 to-pink-200 hover:from-yellow-100 hover:to-orange-500 dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-900 dark:hover:from-yellow-600 dark:hover:to-orange-950 dark:text-slate-300'} 
                  ${application.status === 'Deleted' && 'bg-gradient-to-r from-pink-100 to-pink-200 hover:from-slate-200 hover:to-gray-700 dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-900 dark:text-slate-300'}`}
                    >
                    Show Status
                    </button>
                    </Tooltip>
                    </strong>
                    {statusVisibility[application._id] && (
                      <span>
                        {application.status === 'Accepted' && (
                          <span className="text-green-600 dark:text-green-400"> Accepted</span>
                        )}
                        {application.status === 'Rejected' && (
                          <span className="text-red-600 dark:text-red-400">
                            Rejected
                            {application.reason && (
                              <span className="ml-2 text-gray-700 dark:text-gray-400">Reason: {application.reason}</span>
                            )}
                          </span>
                        )}
                        {application.status === 'Pending' && (
                          <span className="text-yellow-600 dark:text-yellow-400"> Pending</span>
                        )}
                      </span>
                    )}
                  </p>
                  <div className="flex justify-end mt-4">
                  <Tooltip title="Edit your application">
                  <IconButton
                      onClick={() => handleEditClick(application)}
                      className="text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-gray-500"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    </Tooltip>
                    <Tooltip title="Note: Clicking here will delete your application from the company side also , and you will not be able to apply again for this job.">
                      <IconButton
                        onClick={() => handleDeleteClick(application._id)}
                        className="text-red-600 dark:text-red-200 hover:bg-red-100 dark:hover:bg-gray-500 ml-2"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
