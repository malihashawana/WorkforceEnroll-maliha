import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';


function Company_Dashboard() {
  const navigate = useNavigate();


  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');


  const [jobDescription, setJobDescription] = useState({
    introduction: 'We are looking for a dedicated Marketing Manager to lead our campaigns and strategy.',
    responsibilities: 'You will manage social media accounts, develop marketing strategies, and collaborate with the sales team.',
    impact: 'Your efforts will directly impact our brand’s growth and engagement with customers.',
  });

  const [requiredSkills, setRequiredSkills] = useState({
    technicalSkills: 'Proficiency in JavaScript, React, and Node.js.',
    softSkills: 'Strong collaboration and communication skills.',
    experience: 'A bachelor’s degree in Computer Science or 3+ years of experience in web development.',
  });


  const [isEditingJobDesc, setIsEditingJobDesc] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('Users'));
    if (user && user.user1) {
      setCompanyName(user.user1.company_name);
      setCompanyEmail(user.user1.company_email);
      setCompanyAddress(user.user1.company_address);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('Users');
    navigate('/');
  };


  const toggleEditJobDesc = () => setIsEditingJobDesc(!isEditingJobDesc);
  const toggleEditSkills = () => setIsEditingSkills(!isEditingSkills);
  const saveJobDesc = () => {
    setIsEditingJobDesc(false);
  };
  const saveSkills = () => {
    setIsEditingSkills(false);
  };


  return (
    <div className="h-screen flex flex-col">
      {/* Header Section */}
      <div className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white p-4 flex justify-between items-center border-b-2">
        <h1 className="font-bold text-2xl">Company Dashboard</h1>
        <h1 className="font-bold text-1xl">Welcome {companyName}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>


      <div className="flex flex-1">
        {/* Sidebar Section */}
        <nav className="w-64 bg-gray-800 text-white p-4 flex-shrink-0">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => navigate('/addjobs')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Add Jobs
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => navigate('/created_jobs')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Created Jobs
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => navigate(`/accepted_applications/${companyId}`)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Accepted Applications
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => navigate(`/rejected_applications/${companyId}`)}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Rejected Applications
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => navigate('/ApplicantsTable')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Applicants
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => navigate('/company-bookmarked-jobs')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Bookmarked Jobs
              </button>
            </li>
          </ul>
        </nav>



        {/* Main Section */}
        <div className="flex-1 p-8 bg-cover bg-center" style={{ backgroundImage: `url('https://img.freepik.com/free-photo/millennial-asia-businessmen-businesswomen-meeting-brainstorming-ideas-about-new-paperwork-project-colleagues-working-together-planning-success-strategy-enjoy-teamwork-small-modern-night-office_7861-2386.jpg?size=626&ext=jpg&ga=GA1.1.1599778208.1716446894&semt=ais_hybrid')` }}>
          <div className="max-w-md bg-white bg-opacity-80 p-4 rounded-md">
            <h1 className="mb-2 text-3xl font-bold text-left">Hello, {companyName}!</h1>
            <p className="mb-5 text-left">Email: {companyEmail}<br />Address: {companyAddress}</p>


            {/* Job Description Section */}
            <h2 className="text-xl font-bold text-left mb-2">Job Description</h2>
            {isEditingJobDesc ? (
              <>
                <textarea value={jobDescription.introduction} onChange={(e) => setJobDescription({ ...jobDescription, introduction: e.target.value })} placeholder="Introduction" className="textarea textarea-bordered textarea-xs w-full max-w-xs mb-2" />
                <textarea value={jobDescription.responsibilities} onChange={(e) => setJobDescription({ ...jobDescription, responsibilities: e.target.value })} placeholder="Responsibilities" className="textarea textarea-bordered textarea-xs w-full max-w-xs mb-2" />
                <textarea value={jobDescription.impact} onChange={(e) => setJobDescription({ ...jobDescription, impact: e.target.value })} placeholder="Impact" className="textarea textarea-bordered textarea-xs w-full max-w-xs mb-2" />
                <Button onClick={saveJobDesc} variant="contained" color="primary" startIcon={<SaveIcon />}>Save</Button>
              </>
            ) : (
              <>
                <p><strong>Introduction:</strong> {jobDescription.introduction}</p>
                <p><strong>Responsibilities:</strong> {jobDescription.responsibilities}</p>
                <p><strong>Impact:</strong> {jobDescription.impact}</p>
                <IconButton onClick={toggleEditJobDesc} aria-label="edit"><EditIcon /></IconButton>
              </>
            )}


            {/* Required Knowledge, Skills and Abilities Section */}
            <h2 className="text-xl font-bold text-left mt-4 mb-2">Required Knowledge, Skills, and Abilities</h2>
            {isEditingSkills ? (
              <>
                <textarea value={requiredSkills.technicalSkills} onChange={(e) => setRequiredSkills({ ...requiredSkills, technicalSkills: e.target.value })} placeholder="Technical Skills" className="textarea textarea-bordered textarea-xs w-full max-w-xs mb-2" />
                <textarea value={requiredSkills.softSkills} onChange={(e) => setRequiredSkills({ ...requiredSkills, softSkills: e.target.value })} placeholder="Soft Skills" className="textarea textarea-bordered textarea-xs w-full max-w-xs mb-2" />
                <textarea value={requiredSkills.experience} onChange={(e) => setRequiredSkills({ ...requiredSkills, experience: e.target.value })} placeholder="Experience" className="textarea textarea-bordered textarea-xs w-full max-w-xs mb-2" />
                <Button onClick={saveSkills} variant="contained" color="primary" startIcon={<SaveIcon />}>Save</Button>
              </>
            ) : (
              <>
                <p><strong>Technical Skills:</strong> {requiredSkills.technicalSkills}</p>
                <p><strong>Soft Skills:</strong> {requiredSkills.softSkills}</p>
                <p><strong>Experience/Qualifications:</strong> {requiredSkills.experience}</p>
                <IconButton onClick={toggleEditSkills} aria-label="edit"><EditIcon /></IconButton>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default Company_Dashboard;
