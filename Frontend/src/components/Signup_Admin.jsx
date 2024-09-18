import React,{ useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import axios from "axios";
import { IconButton, InputAdornment, TextField } from '@mui/material'; // Import MUI components
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
function Signup_Admin() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // Initialize useNavigate
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async(data) => {
    const userInfo={
        admin_name:data.admin_name,
        admin_email:data.admin_email,
        password:data.password,
      }
      await axios.post("http://localhost:4001/user2/signup_admin",userInfo)
      .then((res)=>{
        console.log(res.data)
        if(res.data){
          toast.success('Admin added Successfully');
          navigate('/admin_dashboard')
          //alert("Signup Successful")
        }
        localStorage.setItem("Users",JSON.stringify(res.data));
      }
    ).catch((err)=>{
      //if(err.response){
        console.log(err)
      //alert("Error:" +err.response.data.message);
      //alert("Already Exists")
      toast.error('Already Exists');
      }
    //}
  
    )
    };

  return (
    <>
      <div id="my_modal_admin" className="flex h-screen items-center justify-center bg-blue-100 dark:bg-slate-600">
        <div className='w-[600px]'>
          <div className="modal-box dark:bg-slate-900 dark:text-white">
            <form onSubmit={handleSubmit(onSubmit)}>
              <p><Link to="/admin_dashboard" className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</Link></p>
              <div className="flex justify-center mt-4 border-[3px] border-orange-300 py-3 rounded-md">
                <h3 className="font-bold text-2xl cursor-default mt-[-5px]">Add Admin</h3>
              </div>

              <div className='mt-4 space-y-2 font-bold'>
                <span>Admin-Name</span>
                <br />
                <input
                  type='text'
                  placeholder='Enter Admin-name'
                  className='w-80 px-3 py-1 border border-orange-300 rounded-md outline-none dark:text-slate-900'
                  {...register("admin_name", { required: true })}
                />
                <br />
                {errors.admin_name && <span className="text-sm text-red-500">This field is required</span>}
              </div>

              <div className='mt-4 space-y-2 font-bold'>
                <span>Admin-Email</span>
                <br />
                <input
                  type='email'
                  placeholder='Enter Admin-email'
                  className='w-80 px-3 py-1 border border-orange-300 rounded-md outline-none dark:text-slate-900'
                  {...register("admin_email", { required: true })}
                />
                <br />
                {errors.admin_email && <span className="text-sm text-red-500">This field is required</span>}
              </div>

              <div className='mt-4 space-y-2'>
              <span>Password</span>
              <br />
              <TextField
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter Password'
                className='w-80 px-3 py-1 border border-orange-300 rounded-md outline-none  dark:bg-slate-200 dark:text-slate-900'
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
                <button className='bg-purple-500 text-white rounded-md px-3 py-1 hover:bg-purple-700 duration-300 cursor-pointer'>Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup_Admin;
