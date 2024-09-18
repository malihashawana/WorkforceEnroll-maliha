import React, { useEffect, useState } from 'react';
import { Link,useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
    if (!dateString) {
        return "N/A";
    }
    
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};
function EditJob() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [formData, setFormData] = useState({
        jobTitle: '',
        companyName: '',
        location: '',
        workMode: '',
        jobType: '',
        jobCategory: '',
        experienceLevel: '',
        minSalary: '',
        maxSalary: '',
        negotiable: false,
        responsibilities: '',
        requirements: '',
        preferredQualifications: '',
        benefits: '',
        deadline:''
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`http://localhost:4001/jobs/${jobId}`);
                if (response.ok) {
                    const data = await response.json();
                    setJob(data);
                    setFormData({
                        jobTitle: data.jobTitle || '',
                        companyName: data.companyName || '',
                        location: data.location || '',
                        workMode: data.workMode || '',
                        jobType: data.jobType || '',
                        jobCategory: data.jobCategory || '',
                        experienceLevel: data.experienceLevel || '',
                        minSalary: data.minSalary || '',
                        maxSalary: data.maxSalary || '',
                        negotiable: data.negotiable || false,
                        responsibilities: data.responsibilities || '',
                        requirements: data.requirements || '',
                        preferredQualifications: data.preferredQualifications || '',
                        benefits: data.benefits || '',
                        deadline: data.deadline || '',
                    });
                } else {
                    toast.error('Failed to fetch job details');
                }
            } catch (error) {
                toast.error('Error fetching job details');
                console.error('Error:', error);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:4001/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                toast.success('Job updated successfully');
                navigate('/created_jobs');
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to update job');
            }
        } catch (error) {
            toast.error('Failed to update job');
            console.error('Error:', error);
        }
    };

    if (!job) {
        return <div className="p-6 bg-gray-100 dark:bg-slate-800 min-h-screen">Loading...</div>;
    }


    return (
        <div className="p-6 bg-gray-100 dark:bg-slate-800 min-h-screen">
            <p><Link to="/company_dashboard" className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-gray-200 dark:hover:bg-slate-600'>✕</Link></p>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit Job</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                        <label className="block mb-2 dark:text-white">Job Title</label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            //onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Work Mode</label>
                        <select
                            name="workMode"
                            value={formData.workMode}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        >
                            <option value="on-site">On-site</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Job Type</label>
                        <select
                            name="jobType"
                            value={formData.jobType}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        >
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="contract">Contract</option>
                            <option value="internship">Internship</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Job Category</label>
                        <select
                            name="jobCategory"
                            value={formData.jobCategory}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        >
                            <option value="it">IT</option>
                            <option value="marketing">Marketing</option>
                            <option value="finance">Finance</option>
                            <option value="hr">HR</option>
                            <option value="sales">Sales</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Experience Level</label>
                        <select
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        >
                            <option value="entry-level">Entry-level</option>
                            <option value="mid-level">Mid-level</option>
                            <option value="senior-level">Senior-level</option>
                            <option value="manager">Manager</option>
                            <option value="director">Director</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Min Salary</label>
                        <input
                            type="number"
                            name="minSalary"
                            value={formData.minSalary}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Max Salary</label>
                        <input
                            type="number"
                            name="maxSalary"
                            value={formData.maxSalary}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Negotiable</label>
                        <input
                            type="checkbox"
                            name="negotiable"
                            checked={formData.negotiable}
                            onChange={handleChange}
                            className="mr-2 leading-tight"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Responsibilities</label>
                        <textarea
                            name="responsibilities"
                            value={formData.responsibilities}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Requirements</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Preferred Qualifications</label>
                        <textarea
                            name="preferredQualifications"
                            value={formData.preferredQualifications}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Benefits</label>
                        <textarea
                            name="benefits"
                            value={formData.benefits}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 dark:text-white">Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={formatDate(formData.deadline)}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    Update Job
                </button>
            </form>
        </div>
    );
}

export default EditJob;
