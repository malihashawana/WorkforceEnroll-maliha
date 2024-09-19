

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');


 
  React.useEffect(() => {
    const query = new URLSearchParams(location.search);
    setToken(query.get('token'));
  }, [location.search]);


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }


    try {
      const response = await axios.post('http://localhost:4001/password-reset/reset-password', {
        token,
        password
      });


      if (response.data.message === 'Password reset successful') {
        toast.success('Password reset successfully. You can now log in with your new password.');
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-lg rounded bg-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border rounded-md outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2 mt-4">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border rounded-md outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 text-white rounded-md px-3 py-2 hover:bg-blue-700 duration-300"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}


export default ResetPassword;
