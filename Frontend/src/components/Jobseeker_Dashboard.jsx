

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';


function Jobseeker_Dashboard() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [_id, setUserId] = useState(null);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('Users'));
    if (user && user.fullname) {
      setFullName(user.fullname);
      setUserId(user._id); // Assuming user data includes _id
      localStorage.setItem('UserId', user._id); // Store userId in local storage
      console.log('User ID:', user._id);
    } else {
      navigate('/'); // Redirect if no user data is found
    }
  }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem('Users');
    localStorage.removeItem('UserId');
    navigate('/');
  };


  const handleProfileClick = () => {
    navigate('/profile'); // Navigate to the Profile Page
  };


  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white p-4 flex justify-between items-center border-b-2 ">
        <h1 className="font-bold text-2xl">Jobseeker Dashboard</h1>
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-3xl cursor-pointer hover:text-gray-500 transition duration-300 "
            onClick={handleProfileClick} // Make icon clickable
          />
          <h1 className="font-bold text-xl">Welcome    <span className='text-red-600'>{fullName}</span></h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
      <div className="flex flex-1">
        <nav className="w-64 bg-gray-800 text-white p-4">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => navigate('/all_jobs')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Jobs
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => navigate('/applications')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Applications
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => navigate('/bookmarked')}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                Bookmarked Jobs
              </button>
            </li>
          </ul>
        </nav>
        <div className="flex-1 p-4">
          {/* Main content */}
        </div>
      </div>
    </div>
  );
}


export default Jobseeker_Dashboard;


