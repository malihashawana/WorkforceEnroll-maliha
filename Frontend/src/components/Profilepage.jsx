import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';


function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    bloodGroup: '',
    religion: '',
    dateOfBirth: '',
    institution: '',
    sscOlevel: '',
    hscAlevel: '',
    sex: '',
    image: null,
  });
  const [isNewUser, setIsNewUser] = useState(false);


  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/profiles');
        if (response.ok) {
          const userData = await response.json();
          setProfile(userData);
          setIsNewUser(!userData.fullname); // Check if user is new based on profile data
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };


    fetchData();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, image: file });
  };


  const handleSave = async () => {
    const formData = new FormData();
    formData.append('fullname', profile.fullname);
    formData.append('email', profile.email);
    formData.append('phoneNumber', profile.phoneNumber);
    formData.append('bloodGroup', profile.bloodGroup);
    formData.append('religion', profile.religion);
    formData.append('dateOfBirth', profile.dateOfBirth);
    formData.append('institution', profile.institution);
    formData.append('sscOlevel', profile.sscOlevel);
    formData.append('hscAlevel', profile.hscAlevel);
    formData.append('sex', profile.sex);
    if (profile.image) formData.append('image', profile.image); // Append image if present


    try {
      const response = await fetch('http://localhost:4001/api/profiles', {
        method: 'POST', // POST for saving new user
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert('Profile saved successfully');
        setIsNewUser(false); // Mark as existing user after saving
      } else {
        alert(result.message || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred');
    }
  };


  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('fullname', profile.fullname);
    formData.append('email', profile.email);
    formData.append('phoneNumber', profile.phoneNumber);
    formData.append('bloodGroup', profile.bloodGroup);
    formData.append('religion', profile.religion);
    formData.append('dateOfBirth', profile.dateOfBirth);
    formData.append('institution', profile.institution);
    formData.append('sscOlevel', profile.sscOlevel);
    formData.append('hscAlevel', profile.hscAlevel);
    formData.append('sex', profile.sex);
    if (profile.image) formData.append('image', profile.image); // Append image if present


    try {
      const response = await fetch('http://localhost:4001/api/profiles', {
        method: 'PUT', 
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert('Profile updated successfully');
      } else {
        alert(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred');
    }
  };


  const handleResumeBuilder = () => {
    window.open('https://app.flowcv.com/dashboard', '_blank');
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden bg-gray-200 flex items-center justify-center">
              {profile.image ? (
                <img src={URL.createObjectURL(profile.image)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FontAwesomeIcon icon={faUserCircle} className="text-6xl" />
              )}
            </div>
          </div>
          <form className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={profile.fullname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">Blood Group</label>
                <input
                  type="text"
                  id="bloodGroup"
                  name="bloodGroup"
                  value={profile.bloodGroup}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="religion" className="block text-sm font-medium text-gray-700">Religion</label>
                <input
                  type="text"
                  id="religion"
                  name="religion"
                  value={profile.religion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institution</label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={profile.institution}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="sscOlevel" className="block text-sm font-medium text-gray-700">SSC/O-Level</label>
                <input
                  type="text"
                  id="sscOlevel"
                  name="sscOlevel"
                  value={profile.sscOlevel}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="hscAlevel" className="block text-sm font-medium text-gray-700">HSC/A-Level</label>
                <input
                  type="text"
                  id="hscAlevel"
                  name="hscAlevel"
                  value={profile.hscAlevel}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-700">Sex</label>
                <select
                  id="sex"
                  name="sex"
                  value={profile.sex}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={isNewUser ? handleSave : handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isNewUser ? 'Save' : 'Update'}
              </button>
              <button
                type="button"
                onClick={handleResumeBuilder}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
              >
                Resume Builder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default UserProfile;
