import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Jobseeker_Dashboard() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [_id, setUserId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('Users'));
    //console.log('User Data:', user); // Debugging line
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

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-200 text-black dark:bg-gray-700 dark:text-white p-4 flex justify-between items-center border-b-2">
        <h1 className="font-bold text-2xl">Jobseeker Dashboard</h1>
        <h1 className="font-bold text-xl">Welcome {fullName}</h1>
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
            {/* Add more sidebar items here */}
            <li className="mb-2">
              <button
                onClick={() => navigate('/bookmarked')} // New button to navigate to Bookmarked Jobs
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
