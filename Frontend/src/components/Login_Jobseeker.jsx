import React, { useState } from 'react'; // Import useState
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from 'react-hot-toast';
import { IconButton, InputAdornment, TextField } from '@mui/material'; // Import MUI components
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login_Jobseeker() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to handle password visibility

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:4001/user/login_jobseeker", data);
      const userData = response.data.user;

      if (userData) {
        localStorage.setItem("Users", JSON.stringify(userData));
        toast.success('Login Successful');
        navigate('/jobseeker_dashboard');
      }
    } catch (err) {
      console.log(err);
      toast.error('Wrong Email or Password');
    }
  };

  const handleCloseModal = (event) => {
    event.preventDefault();
    document.getElementById("my_modal_jobseeker").close();
    navigate("/");
  };

  return (
    <dialog id="my_modal_jobseeker" className="modal">
      <div className="modal-box dark:bg-slate-900 dark:text-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <button
            type="button"
            className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
            onClick={handleCloseModal}
          >
            ✕
          </button>

          <h3 className="font-bold text-lg cursor-default">Login</h3>

          <div className='mt-4 space-y-2'>
            <span>Email</span>
            <br />
            <input
              type='email'
              placeholder='Enter your email'
              className='w-80 px-3 py-1 border rounded-md outline-none dark:text-slate-900'
              {...register("email", { required: true })}
            />
            <br />
            {errors.email && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          <div className='mt-4 space-y-2'>
            <span>Password</span>
            <br />
            <TextField
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter your Password'
              className='w-80 px-3 py-1 border rounded-md outline-none dark:bg-slate-200 dark:text-slate-900'
              {...register("password", { required: true })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <br />
            {errors.password && <span className="text-sm text-red-500">This field is required</span>}
          </div>

          <div className='flex justify-around mt-4'>
            <button type="submit" className='bg-purple-500 text-white rounded-md px-3 py-1 hover:bg-purple-700 duration-300'>Login</button>
            <p>
              Not registered? <Link to="/signup_jobseeker" className='underline text-blue-500 cursor-pointer'>Signup</Link>{" "}
            </p>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default Login_Jobseeker;
