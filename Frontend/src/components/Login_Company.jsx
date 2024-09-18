import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IconButton, InputAdornment, TextField } from '@mui/material'; // Import MUI components
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login_Company() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to handle password visibility

  const onSubmit = async (data) => {
    try {
      const userInfo = {
        company_name: data.company_name,
        company_email: data.company_email,
        password: data.password,
      };

      const response = await axios.post("http://localhost:4001/user1/login_company", userInfo);
      console.log(response.data);

      if (response.data) {
        toast.success('Login Successful');
        localStorage.setItem("Users", JSON.stringify(response.data));
        navigate('/company_dashboard');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Wrong Email or Password');
    }
  };

  const handleCloseModal = (event) => {
    event.preventDefault();
    document.getElementById("my_modal_company").close();
    navigate("/");
  };

  return (
    <div>
      <dialog id="my_modal_company" className="modal">
        <div className="modal-box dark:bg-slate-900 dark:text-white">
          <form onSubmit={handleSubmit(onSubmit)} method='dialog'>
            <button
              type="button"
              className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
              onClick={handleCloseModal}
            >
              ✕
            </button>

            <h3 className="font-bold text-lg cursor-default">Company Login</h3>

            <div className='mt-4 space-y-2'>
              <span>Company-Name</span>
              <br />
              <input 
                type='text'
                placeholder='Enter Company-name'
                className='w-80 px-3 py-1 border rounded-md outline-none dark:text-slate-900'
                {...register("company_name", { required: true })}
              />
              <br />
              {errors.company_name && <span className="text-sm text-red-500">This field is required</span>}
            </div>

            <div className='mt-4 space-y-2'>
              <span>Company-Email</span>
              <br />
              <input 
                type='email'
                placeholder='Enter Company-email'
                className='w-80 px-3 py-1 border rounded-md outline-none dark:text-slate-900'
                {...register("company_email", { required: true })}
              />
              <br />
              {errors.company_email && <span className="text-sm text-red-500">This field is required</span>}
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
              <br />
              {errors.password && <span className="text-sm text-red-500">This field is required</span>}
            </div>

            <div className='flex justify-around mt-4'>
              <button className='bg-purple-500 text-white rounded-md px-3 py-1 hover:bg-purple-700 duration-300'>Login</button>
              
              <p>
                Not registered? <Link to="/signup_company" className='underline text-blue-500 cursor-pointer'>Signup</Link>
              </p>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default Login_Company;
