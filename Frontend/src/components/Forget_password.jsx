import React from 'react';
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


function Forget_password() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
     
      const response = await axios.post("http://localhost:4001/user/forget_password", data);
     
      if (response.data.success) {
        toast.success('Password reset link sent to your email.');
      }
    } catch (err) {
      console.log(err);
      toast.error('Failed to send reset link. Please try again.');
    }
  };


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-96 p-6 shadow-lg rounded bg-white">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          ← Back
        </button>
       
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password :</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='space-y-2'>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Enter your email :
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className='w-full px-3 py-2 border rounded-md outline-none'
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
          </div>


          <button
            type="submit"
            className='w-full mt-4 bg-blue-500 text-white rounded-md px-3 py-2 hover:bg-blue-700 duration-300'
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}


export default Forget_password;
