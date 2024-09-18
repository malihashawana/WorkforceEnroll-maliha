import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';


function Rejected_Applications() {
    const { companyId } = useParams();
    const [applications, setApplications] = useState([]);
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedJobTitle, setExpandedJobTitle] = useState(null);
    const [applicationCounts, setApplicationCounts] = useState({}); // Store application counts
    const [acceptedCounts, setAcceptedCounts] = useState({});
    const [rejectedCounts, setRejectedCounts] = useState({});


    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:4001/applications/company/${companyId}/rejected`);
                if (!response.ok) {
                    throw new Error('Failed to fetch rejected applications');
                }
                const data = await response.json();
                setApplications(data);
                //const jobIds = data.map(app => app.jobId._id);
                // Fetch application counts
                const validJobIds = data
                    .filter(app => app.jobId && app.jobId._id) // Filter out invalid jobIds
                    .map(app => app.jobId._id);
                {/*const counts = await fetchApplicationCounts(jobIds);
                setApplicationCounts(counts);
                const acceptedAndRejectedCounts = await fetchAcceptedAndRejectedCounts(jobIds);
                setRejectedCounts(acceptedAndRejectedCounts.rejected);*/}
                
                // Fetch application counts
                const counts = await fetchApplicationCounts(validJobIds);
                setApplicationCounts(counts);
                const acceptedAndRejectedCounts = await fetchAcceptedAndRejectedCounts(validJobIds);
                setAcceptedCounts(acceptedAndRejectedCounts.accepted);
                setRejectedCounts(acceptedAndRejectedCounts.rejected);


            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
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
            try {
                const counts = {};
                for (const jobId of jobIds) {
                    const response = await fetch(`http://localhost:4001/applications/job/${jobId}/counts`);
                    if (response.ok) {
                        const data = await response.json();
                        counts[jobId] = data.totalCount;
                    }
                }
                return counts;
            } catch (error) {
                console.error('Error fetching application counts:', error);
                return {};
            }
        };


        fetchApplications();
    }, [companyId]);


    useEffect(() => {
        if (expandedJobTitle) {
            const fetchJobDetails = async () => {
                try {
                    const job = applications.find(app => app.jobId && app.jobId.jobTitle === expandedJobTitle);
                    if (job && job.jobId && job.jobId._id) {
                        const response = await fetch(`http://localhost:4001/jobs/${job.jobId._id}`);
                        if (!response.ok) {
                            throw new Error('Failed to fetch job details');
                        }
                        const jobData = await response.json();
                        setJobDetails(jobData);
                    } else {
                        setJobDetails({});
                    }
                } catch (error) {
                    setError(error.message);
                }
            };
   
            fetchJobDetails();
        }
    }, [expandedJobTitle, applications]);
   


    const handleAccept = async (applicationId) => {
        try {
            const response = await fetch(`http://localhost:4001/applications/${applicationId}/accept`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (!response.ok) {
                throw new Error('Failed to accept the application');
            }


            setApplications(applications.filter(app => app._id !== applicationId));
        } catch (error) {
            setError(error.message);
        }
    };


    const handleDelete = async (applicationId) => {
        try {
            const response = await fetch(`http://localhost:4001/applications/${applicationId}/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            if (!response.ok) {
                throw new Error('Failed to delete the application');
            }


            setApplications(applications.filter(app => app._id !== applicationId));
        } catch (error) {
            setError(error.message);
        }
    };


    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="w-16 h-16 border-4 border-t-4 border-gray-300 border-solid rounded-full animate-spin"></div>
        </div>
    );
    if (error) return <p className="text-red-600">{error}</p>;


    const groupedApplications = applications.reduce((acc, application) => {
        const jobTitle = (application.jobId && application.jobId.jobTitle) || 'You have deleted this job';
        if (!acc[jobTitle]) {
            acc[jobTitle] = [];
        }
        acc[jobTitle].push(application);
        return acc;
    }, {});


    const handleJobTitleClick = (jobTitle) => {
        setExpandedJobTitle(prev => prev === jobTitle ? null : jobTitle);
    };


    const formatDate = (dateString) => {
        if (!dateString) {
            return "N/A";
        }
       
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };


    return (
        <div className="min-h-screen bg-red-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200">
            {/* Navbar */}
            <div className="fixed top-0 left-0 right-0 bg-red-200 dark:bg-slate-800 p-6 z-10 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Rejected Applications</h2>
                <Link to="/company_dashboard" className='text-2xl hover:text-gray-500 dark:hover:text-gray-400'>
                    ✕
                </Link>
            </div>
            {/* Main Content */}
            <div className="pt-24 p-6"> {/* Add padding-top to account for the fixed navbar */}
                {Object.keys(groupedApplications).length > 0 ? (
                    Object.keys(groupedApplications).map(jobTitle => (
                        <div key={jobTitle} className="mb-6">
                            <h3
                                className="text-2xl font-bold mb-4 cursor-pointer"
                                onClick={() => handleJobTitleClick(jobTitle)}
                            >
                                {jobTitle}
                            </h3>
                            {expandedJobTitle === jobTitle && jobDetails && (
    <div className="bg-gray-50 p-4 rounded-md shadow-md dark:bg-slate-300 dark:text-black mb-4 max-w-4xl">
        <h4 className="text-xl font-semibold mb-2">Job Details</h4>
        <p><strong>Job Title:</strong> {jobDetails.jobTitle || 'N/A' }</p>
        <p><strong>Company Name:</strong> {jobDetails.companyName || 'N/A'}</p>
        <p><strong>Location:</strong> {jobDetails.location || 'N/A'}</p>
        <p><strong>Work Mode:</strong> {jobDetails.workMode || 'N/A'}</p>
        <p><strong>Job Type:</strong> {jobDetails.jobType || 'N/A'}</p>
        <p><strong>Job Category:</strong> {jobDetails.jobCategory || 'N/A'}</p>
        <p><strong>Experience Level:</strong> {jobDetails.experienceLevel || 'N/A'}</p>
        <p><strong>Salary Range:</strong> BDT {jobDetails.minSalary || 'N/A'} - {jobDetails.maxSalary || 'N/A'}</p>
        <p><strong>Preferred Qualifications:</strong> {jobDetails.preferredQualifications || 'N/A'}</p>
        <p><strong>Requirements:</strong> {jobDetails.requirements || 'N/A'}</p>
        <p><strong>Responsibilities:</strong> {jobDetails.responsibilities || 'N/A'}</p>
        <p><strong>Benefits:</strong> {jobDetails.benefits || 'N/A'}</p>
        <p><strong>Posted:</strong> {formatDate(jobDetails.createdAt)}</p>
        <p><strong>Deadline:</strong> {formatDate(jobDetails.deadline)}</p>
        <p><strong>Applications Count:</strong> {applicationCounts[jobDetails._id] || 0}</p>
        <p><strong>Accepted Applications:</strong> {acceptedCounts[jobDetails._id] || 0}</p>
        <p><strong>Rejected Applications:</strong> {rejectedCounts[jobDetails._id] || 0}</p>
    </div>
)}


                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {groupedApplications[jobTitle].map(application => (
                                    <div key={application._id} className="bg-red-50 p-6 rounded-md shadow-md dark:bg-slate-300 dark:text-black">
                                        <h4 className="text-xl font-semibold mb-2">
                                            Applicant: {application.fullName}
                                        </h4>
                                        <p><strong>Email:</strong> {application.email}</p>
                                        <p><strong>Phone:</strong> {application.phoneNumber}</p>
                                        <p><strong>Expected Salary:</strong> BDT {application.expectedSalary}</p>
                                        <p><strong>Most Recent Job:</strong> {application.currentJobTitle || 'N/A'} at {application.currentJobEmployer || 'N/A'}</p>
                                        <p><strong>Cover Letter:</strong> {application.coverLetter || 'N/A'}</p>
                                        <p><strong>Applied on:</strong> {formatDate(application.createdAt)}</p>
                                        <div className="mt-4 flex gap-4">
                                            <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleAccept(application._id)}
                                            >
                                                Retrive
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDelete(application._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No rejected applications found.</p>
                )}
            </div>
        </div>
    );
}


export default Rejected_Applications;