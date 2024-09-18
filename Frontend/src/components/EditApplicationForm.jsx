import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useLocation, useParams,Link } from 'react-router-dom';

function EditApplicationForm() {
    const { applicationId } = useParams();
    const location = useLocation();
    const application = location.state?.application;
    const [files, setFiles] = useState({
        coverLetter: null,
        cv: null,
        coverLetterName: 'No file chosen',
        cvName: 'No file chosen'
    });
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (application) {
            setValue('fullName', application.fullName);
            setValue('email', application.email);
            setValue('phoneNumber', application.phoneNumber);
            setValue('expectedSalary', application.expectedSalary);
            setValue('currentJobTitle', application.currentJobTitle);
            setValue('currentJobEmployer', application.currentJobEmployer);

            setFiles({
                coverLetter: null,
                cv: null,
                coverLetterName: application.coverLetterOriginalName || 'No file chosen',
                cvName: application.cvOriginalName || 'No file chosen'
            });
        } else {
            toast.error('No application data found.');
            navigate('/jobseeker_dashboard'); // Redirect if no application data is found
        }
    }, [application, navigate, setValue]);

    const handleFormSubmit = async (data) => {
        if (!application) {
            toast.error('Application data is missing.');
            return;
        }

        const formData = new FormData();
        formData.append('applicationId', application._id);
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

        try {
            const response = await fetch('http://localhost:4001/applications/updateapplication', {
                method: 'PUT',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || 'Application updated successfully');
                navigate('/jobseeker_dashboard');
            } else {
                toast.error(result.message || 'Failed to update application');
            }
        } catch (error) {
            toast.error('An error occurred while updating the application.');
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFiles(prevFiles => ({
                ...prevFiles,
                [name]: files[0],
                [`${name}Name`]: files[0].name
            }));
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200  dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-900">
            <div className="relative w-[600px] bg-gradient-to-r from-yellow-100 to-orange-200  p-6 rounded-md shadow-md dark:bg-gradient-to-r dark:from-slate-500 dark:to-gray-500 dark:text-slate-200">
            <p className="absolute right-2 top-2">
                    <Link to="/applications" className='btn btn-sm btn-circle btn-ghost hover:bg-orange-300 dark:hover:bg-slate-600'>
                        ✕
                    </Link>
                </p>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <h2 className="text-2xl font-bold mb-6 border-b-2 pb-2 border-gray-300 dark:border-slate-700">Edit Application</h2>
                    
                    <div className="mb-3">
                        <label className="block mb-1">Full Name:</label>
                        <input type="text" {...register('fullName', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white" />
                        {errors.fullName && <p className="text-red-500 text-sm">This field is required</p>}
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1">Email Address:</label>
                        <input type="email" {...register('email', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white" />
                        {errors.email && <p className="text-red-500 text-sm">This field is required</p>}
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1">Phone Number:</label>
                        <input type="tel" {...register('phoneNumber', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white" />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">This field is required</p>}
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1">Expected Salary:</label>
                        <input type="number" {...register('expectedSalary', { required: true })} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-white" />
                        {errors.expectedSalary && <p className="text-red-500 text-sm">This field is required</p>}
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1">Current/Most Recent Job Title:</label>
                        <input type="text" {...register('currentJobTitle')} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-slate-200" />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1">Current/Most Recent Job Employer:</label>
                        <input type="text" {...register('currentJobEmployer')} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-slate-800 dark:text-slate-200" />
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 dark:text-slate-200">Cover Letter:</label>
                        <input type="file" name="coverLetter" onChange={handleFileChange} className="block" />
                        <p>Current file: {files.coverLetterName}</p>
                    </div>
                    <div className="mb-3">
                        <label className="block mb-1 dark:text-slate-200">CV:</label>
                        <input type="file" name="cv" onChange={handleFileChange} className="block" />
                        <p>Current file: {files.cvName}</p>
                    </div>
                    <div className="mb-3">
                        <label className="inline-flex items-center">
                            <input type="checkbox" {...register('termsAccepted', { required: true })} className="form-checkbox" />
                            <span className="ml-2">I agree to the terms and conditions</span>
                        </label>
                        {errors.termsAccepted && <p className="text-red-500 text-sm">You must accept the terms and conditions</p>}
                    </div>
                    <button type="submit" className="bg-blue-500 dark:bg-blue-900 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md">Update Application</button>
                </form>
            </div>
        </div>
    );
}

export default EditApplicationForm;
