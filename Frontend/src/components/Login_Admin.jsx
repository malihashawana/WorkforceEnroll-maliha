import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from 'react-hot-toast';
import { IconButton, InputAdornment, TextField } from '@mui/material'; // Import MUI components
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login_Admin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to handle password visibility

  const onSubmit = async (data) => {
    try {
      const userInfo = {
        admin_name: data.admin_name,
        admin_email: data.admin_email,
        password: data.password,
      };

      const response = await axios.post("http://localhost:4001/user2/login_admin", userInfo);
      console.log(response.data);

      if (response.data) {
        toast.success('Login Successful');
        navigate('/admin_dashboard');
      }

      localStorage.setItem("Users", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error:", error);
      toast.error('Wrong Email or Password');
    }
  };

  const handleCloseModal = (event) => {
    event.preventDefault(); // Prevent form submission
    document.getElementById("my_modal_admin").close(); // Close modal
    setTimeout(() => document.body.classList.remove('modal-open'), 300);
  };

  return (
    <div>
      <dialog id="my_modal_admin" className="modal">
        <div className="modal-box dark:bg-slate-900 dark:text-white">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            <button
              type="button"
              className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
              onClick={handleCloseModal}
            >
              ✕
            </button>

            <h3 className="font-bold text-lg cursor-default">Admin Login</h3>

            <div className='mt-4 space-y-2'>
              <span>Admin-Name</span>
              <br/>
              <input 
                type='text'
                placeholder='Enter Admin-name'
                className='w-80 px-3 py-1 border rounded-md outline-none dark:text-slate-900'
                {...register("admin_name", { required: true })}
              />
              <br/>
              {errors.admin_name && <span className="text-sm text-red-500">This field is required</span>}
            </div>

            <div className='mt-4 space-y-2'>
              <span>Admin-Email</span>
              <br/>
              <input 
                type='email'
                placeholder='Enter Admin-email'
                className='w-80 px-3 py-1 border rounded-md outline-none dark:text-slate-900'
                {...register("admin_email", { required: true })}
              />
              <br/>
              {errors.admin_email && <span className="text-sm text-red-500">This field is required</span>}
            </div>

            <div className='mt-4 space-y-2'>
              <span>Password</span>
              <br />
              <TextField
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter Password'
                className='w-80 px-3 py-1 border rounded-md outline-none dark:text-slate-900 dark:bg-slate-200'
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
              <br/>
              {errors.password && <span className="text-sm text-red-500">This field is required</span>}
            </div>

            <div className='flex justify-around mt-4'>
              <button className='bg-purple-500 text-white rounded-md px-3 py-1 hover:bg-purple-700 duration-300 cursor-pointer'>Login</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login_Admin;
