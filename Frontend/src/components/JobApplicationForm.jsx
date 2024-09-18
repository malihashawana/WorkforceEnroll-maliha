import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';


function JobApplicationForm() {
    const location = useLocation();
    const job = location.state?.job;
    const [page, setPage] = useState(1);
    const { register, handleSubmit, formState: { errors }, trigger, setValue } = useForm();
    const [files, setFiles] = useState({ coverLetter: null, cv: null });
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve userId from localStorage
        const storedUserId = localStorage.getItem('UserId');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            toast.error('User not logged in');
            navigate('/');
        }
    }, [navigate]);


    useEffect(() => {
        console.log(job); // Add this line
        if (job) {
            setValue('jobTitle', job.jobTitle);
            setValue('companyName', job.companyName);
            setValue('location', job.location);
            setValue('minSalary', job.minSalary);
            setValue('maxSalary', job.maxSalary);
            setValue('workMode', job.workMode);
        } else {
            toast.error('No job data found');
        }
    }, [job, setValue]);


    const handleFormSubmit = async (data) => {
        if (!userId) {
            toast.error('User not logged in');
            return;
        }


        const formData = new FormData();
        formData.append('userId', userId); // Use stored userId
        formData.append('jobId', job._id);
        formData.append('companyId', job.company._id); // Add companyId
        formData.append('fullName', data.fullName);
        formData.append('email', data.email);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('expectedSalary', data.expectedSalary);
        formData.append('currentJobTitle', data.currentJobTitle);
        formData.append('currentJobEmployer', data.currentJobEmployer);
        if (files.coverLetter) {
            formData.append('coverLetter', files.coverLetter);
        }
        if (files.cv) {
            formData.append('cv', files.cv);
        }
        formData.append('termsAccepted', data.terms);


        try {
            const response = await fetch('http://localhost:4001/applications/addapplication', {
                method: 'POST',
                body: formData,
            });


            const result = await response.json();


            if (response.ok) {
                toast.success( result.message ||'Application submitted successfully');
                navigate('/jobseeker_dashboard');
            } else {
                toast.error(result.message || 'Failed to submit application');
            }
        } catch (error) {
            toast.error('An error occurred while submitting the application.');
        }
    };


    //const handleFileChange = (e) => {
        //setFiles(prevFiles => ({
            //...prevFiles,
            //[e.target.name]: e.target.files[0]
        //}));
       // console.log(e.target.name, e.target.files[0].name);
    //};
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles(prevFiles => ({
            ...prevFiles,
            [name]: files[0]
        }));
    };

    const handleNext = async () => {
        const isValid = await trigger();
        if (isValid || page === 1) {
            setPage(page + 1);
        }
    };

    const handleBack = () => {
        setPage(page - 1);
    };


    return (
        <div className="flex h-screen items-center justify-center bg-gray-200 dark:bg-gradient-to-r dark:from-slate-600 dark:to-slate-700">
            <div className="relative w-[600px] bg-white p-6 rounded-md shadow-md dark:bg-slate-900 dark:text-white">
                <p className="absolute right-2 top-2">
                    <Link to="/all_jobs" className='btn btn-sm btn-circle btn-ghost hover:bg-gray-200 dark:hover:bg-slate-600'>
                        ✕
                    </Link>
                </p>


                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2 border-gray-300 dark:border-slate-700 dark:text-gray-300">Apply for Job</h2>


                    {page === 1 && (
                        <div className="border-2 p-4 rounded-md border-gray-300 dark:border-slate-700">
                            <h3 className="text-xl font-semibold mb-2 border-b-2 pb-2 border-gray-300 dark:border-slate-700 dark:text-gray-300">Job Information</h3>
                            <div className="mb-3 dark:text-gray-300">
                                <label className="block mb-1">Job Title:</label>
                                <p className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300">
                                    {job?.jobTitle || 'N/A'}
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Company Name:</label>
                                <p className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300">
                                    {job?.companyName || 'N/A'}
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Location:</label>
                                <p className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300">
                                    {job?.location || 'N/A'}
                                </p>
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Salary Range:</label>
                                <p className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300">
                                    {job?.minSalary} - {job?.maxSalary}
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={handleNext} className="bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800 px-4 py-2 rounded">Next</button>
                            </div>
                        </div>
                    )}


                    {page === 2 && (
                        <div className="border-2 p-4 rounded-md border-gray-300 dark:border-slate-700 dark:text-gray-300">
                            <h3 className="text-xl font-semibold mb-2 border-b-2 pb-2 border-gray-300 dark:border-slate-700 dark:text-gray-300">Personal Details</h3>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Full Name:</label>
                                <input type="text" {...register('fullName', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300" />
                                {errors.fullName && <p className="text-red-500 text-sm">This field is required</p>}
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Email Address:</label>
                                <input type="email" {...register('email', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300" />
                                {errors.email && <p className="text-red-500 text-sm">This field is required</p>}
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Phone Number:</label>
                                <input type="tel" {...register('phoneNumber', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300" />
                                {errors.phoneNumber && <p className="text-red-500 text-sm">This field is required</p>}
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={handleBack} className="bg-pink-700 text-white hover:bg-pink-900 dark:bg-pink-900 dark:text-white dark:hover:bg-pink-800 px-4 py-2 rounded">Back</button>
                                <button type="button" onClick={handleNext} className="bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800 px-4 py-2 rounded">Next</button>
                            </div>
                        </div>
                    )}


                    {page === 3 && (
                        <div className="border-2 p-4 rounded-md border-gray-300 dark:border-slate-700 dark:text-gray-300">
                            <h3 className="text-xl font-semibold mb-2 border-b-2 pb-2 border-gray-300 dark:border-slate-700 dark:text-gray-300">Application Details</h3>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Expected Salary:</label>
                                <input type="number" {...register('expectedSalary', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300" />
                                {errors.expectedSalary && <p className="text-red-500 text-sm">This field is required</p>}
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Current/Most Recent Job Title:</label>
                                <input type="text" {...register('currentJobTitle')} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300" />
                            </div>
                            <div className="mb-3">
                                <label className="block mb-1 dark:text-gray-300">Current/Most Recent Job Employer:</label>
                                <input type="text" {...register('currentJobEmployer')} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-gray-300" />
                            </div>
                            {/*<div className="mb-3">
                                <label className="block mb-1">Cover Letter (optional):</label>
                                <input type="file" name="coverLetter" onChange={handleFileChange} className="w-full" />
                            </div>*/}

                            <div className="flex justify-between">
                                <button type="button" onClick={handleBack} className="bg-pink-700 text-white hover:bg-pink-900 dark:bg-pink-900 dark:text-white dark:hover:bg-pink-800 px-4 py-2 rounded">Back</button>
                                <button type="button" onClick={handleNext} className="bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800 px-4 py-2 rounded">Next</button>
                            </div>
                        </div>
                    )}


                    {page === 4 && (
                        <div className="border-2 p-4 rounded-md border-gray-300 dark:border-slate-700 dark:text-gray-300">
                            <h3 className="text-xl font-semibold mb-2 border-b-2 pb-2 border-gray-300 dark:border-slate-700 dark:text-gray-300">Upload Documents</h3>
                            {/*<div className="mb-3">
                                <label className="block mb-1">CV:</label>
                                <input type="file" name="cv" onChange={handleFileChange} className="w-full" />
                            </div>*/}
                            <div className="mb-3">
                               <label className="block mb-1 dark:text-gray-300">Cover Letter (optional):</label>
                                 <input type="file" name="coverLetter" onChange={handleFileChange} className="w-full" />
                                    {files.coverLetter && (
                                       <p className="text-gray-700 dark:text-gray-300 mt-2">
                                              Chosen:{files.coverLetter.name}
                                        </p>
                                    )}
                            </div>
                            <div className="mb-3">
    <label className="block mb-1 dark:text-gray-300">CV:</label>
    <input type="file" name="cv" onChange={handleFileChange} className="w-full" />
    {files.cv && (
        <p className="text-gray-700 dark:text-gray-300 mt-2">
            Chosen:{files.cv.name}
        </p>
    )}
</div>

                            <div className="mb-3">
                                <label className="flex items-center">
                                    <input type="checkbox" {...register('terms', { required: true })} />
                                    <span className="ml-2">I agree to the terms and conditions</span>
                                </label>
                                {errors.terms && <p className="text-red-500 text-sm">You must agree to the terms</p>}
                            </div>
                            <div className="flex justify-between">
                                <button type="button" onClick={handleBack} className="bg-pink-700 text-white hover:bg-pink-900 dark:bg-pink-900 dark:text-white dark:hover:bg-pink-800 px-4 py-2 rounded">Back</button>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}


export default JobApplicationForm;