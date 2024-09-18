import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { toast } from 'react-toastify'; // Add toast notifications

const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('Users'));
    return user ? user._id : null;
};

function All_Jobs() {
    const [jobs, setJobs] = useState([]);
    const [expandedJob, setExpandedJob] = useState(null);
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const [userAppliedJobs, setUserAppliedJobs] = useState({});
    const [applicationCounts, setApplicationCounts] = useState({});
    const [acceptedCounts, setAcceptedCounts] = useState({});
    const [rejectedCounts, setRejectedCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const userId = getUserId();

    // Dark mode implementation
    const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");
    const element = document.documentElement;
    useEffect(() => {
        if (theme === "dark") {
            element.classList.add("dark");
            localStorage.setItem("theme", "dark");
            document.body.classList.add("dark");
        } else {
            element.classList.remove("dark");
            localStorage.setItem("theme", "light");
            document.body.classList.remove("dark");
        }
    }, [theme]);
    
    const navItemStyle = {
        color: theme === "dark" ? "white" : "black"
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch(`http://localhost:4001/jobs/all?userId=${userId}`);
                const data = await response.json();
                setJobs(data);
                const bookmarked = data.filter(job => job.isBookmarked).map(job => job._id);
                setBookmarkedJobs(bookmarked);

                // Fetch application status and counts
                const appliedJobs = await fetchUserAppliedJobs(data.map(job => job._id));
                setUserAppliedJobs(appliedJobs);
                const counts = await fetchApplicationCounts(data.map(job => job._id));
                setApplicationCounts(counts);

                const acceptedAndRejectedCounts = await fetchAcceptedAndRejectedCounts(data.map(job => job._id));
                setAcceptedCounts(acceptedAndRejectedCounts.accepted);
                setRejectedCounts(acceptedAndRejectedCounts.rejected);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        const fetchUserAppliedJobs = async (jobIds) => {
            const appliedJobs = {};
            for (const jobId of jobIds) {
                try {
                    const response = await fetch(`http://localhost:4001/applications/check-application/${userId}/${jobId}`);
                    if (response.ok) {
                        const data = await response.json();
                        appliedJobs[jobId] = data.hasApplied === 'yes';
                    } else {
                        appliedJobs[jobId] = false;
                    }
                } catch (error) {
                    appliedJobs[jobId] = false;
                }
            }
            return appliedJobs;
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

        // Search functionality
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }

        const fetchResults = async () => {
            try {
                const response = await fetch(`http://localhost:4001/jobs/search?searchTerm=${encodeURIComponent(searchTermFromUrl)}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        if (searchTermFromUrl) {
            fetchResults();
        } else {
            fetchJobs();
        }
    }, [location.search, userId]);

    const dispJobs = searchTerm ? results : jobs;

    const handleToggle = (index) => {
        setExpandedJob(expandedJob === index ? null : index);
    };

    const handleApply = (job) => {
        if (userAppliedJobs[job._id]) {
            toast.info('You have already applied for this job');
        } else {
            navigate(`/apply/${job._id}`, { state: { job } });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (searchTerm.trim() === "") {
            navigate('/all_jobs');
        } else {
            const urlParams = new URLSearchParams();
            urlParams.set("searchTerm", searchTerm);
            const searchQuery = urlParams.toString();
            navigate(`/all_jobs?${searchQuery}`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) {
            return "N/A";
        }

        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);

        today.setHours(0, 0, 0, 0);
        tomorrow.setDate(today.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        return date.toISOString().split('T')[0];
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='hidden md:block'>
                    <label className="px-3 py-3 border rounded-md flex items-center gap-1">
                        <input 
                            type="text"
                            className="grow outline-none px-2 py-1 border-3 rounded-md dark:bg-slate-900 dark:text-white"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd" />
                        </svg>
                    </label>
                </div>
            </form>

            <label className="swap swap-rotate">
                <input type="checkbox" checked={theme === "dark"} onChange={() => setTheme(theme === "light" ? "dark" : "light")} />
                <svg
                    className="swap-off h-7 w-7 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0L7,18.36A9.88,9.88,0,0,0,12,20a10,10,0,0,0,7.07-2.93A10,10,0,0,0,17,7.05l.72-.71a1,1,0,1,0-1.41-1.41L15.66,5.64A9.88,9.88,0,0,0,12,4a10,10,0,0,0-7.07,2.93A10,10,0,0,0,7,16.95Zm-3.42-5.64a8,8,0,0,1,11.32,0,8,8,0,1,1-11.32,0Z" />
                </svg>
                <svg
                    className="swap-on h-7 w-7 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path d="M12,3a9,9,0,1,1-9,9A9,9,0,0,1,12,3Zm0,16a7,7,0,1,0-7-7A7,7,0,0,0,12,19Z" />
                </svg>
            </label>

            {dispJobs.length === 0 ? (
                <p>No jobs found.</p>
            ) : (
                dispJobs.map((job, index) => (
                    <div key={job._id} className="p-4 border border-gray-300 rounded-lg mb-4">
                        <h2 className="text-lg font-semibold">{job.title}</h2>
                        <p className="text-gray-600">{job.companyName}</p>
                        <p className="text-gray-500">{job.location}</p>
                        <p className="text-gray-500">Applied: {userAppliedJobs[job._id] ? 'Yes' : 'No'}</p>
                        <div>
                            <button onClick={() => handleApply(job)} className="text-sm bg-blue-500 text-white px-4 py-2 rounded-md">
                                {userAppliedJobs[job._id] ? 'Already Applied' : 'Apply'}
                            </button>
                            <button onClick={() => handleToggle(index)} className="text-sm bg-gray-300 px-4 py-2 rounded-md ml-2">
                                {expandedJob === index ? 'Hide Details' : 'Show Details'}
                            </button>
                            <button
                                onClick={() => {
                                    bookmarkedJobs.includes(job._id)
                                        ? handleRemoveBookmark(job._id)
                                        : handleBookmark(job._id);
                                }}
                                className="text-sm px-4 py-2 rounded-md ml-2">
                                {bookmarkedJobs.includes(job._id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            </button>
                        </div>
                        {expandedJob === index && (
                            <div className="mt-4 text-sm text-gray-700">
                                <p className="text-gray-700">Description: {job.description}</p>
                                <p className="text-gray-700">Salary: {job.salary}</p>
                                <p className="text-gray-700">Posted Date: {formatDate(job.postedDate)}</p>
                                <p className="text-gray-700">Total Applicants: {applicationCounts[job._id] || 0}</p>
                                <p className="text-green-600">Accepted: {acceptedCounts[job._id] || 0}</p>
                                <p className="text-red-600">Rejected: {rejectedCounts[job._id] || 0}</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default All_Jobs;
