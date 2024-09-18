import React,{ useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Login_Jobseeker from './Login_Jobseeker';
import axios from "axios";
import toast from 'react-hot-toast';
import { IconButton, InputAdornment, TextField } from '@mui/material'; // Import MUI components
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Signup_Jobseeker() {
  const {
    register,
    handleSubmit,
   
    formState: { errors },
  } = useForm()
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const onSubmit = async(data) => {
    const userInfo={
      fullname:data.fullname,
      email:data.email,
      password:data.password,
    }
    await axios.post("http://localhost:4001/user/signup_jobseeker",userInfo)
    .then((res)=>{
      console.log(res.data)
      if(res.data){
        toast.success('Signup Successful');
        navigate('/')
  
      }
      localStorage.setItem("Users",JSON.stringify(res.data));
    }
  ).catch((err)=>{
      console.log(err)
    toast.error('Already Exists');
    }
  //}


  )
  };
  return (
    <>
    <div className=" flex h-screen items-center justify-center bg-blue-100 dark:bg-slate-600">
    <div className='w-[600px]'>
      <div className='modal-box  dark:bg-slate-900 dark:text-white'>
      <form onSubmit={handleSubmit(onSubmit)} >
      {/* if there is a button in form, it will close the modal */}
      <p><Link to="/" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</Link></p>
     
    <div className="flex justify-center mt-4 border-[3px] border-orange-300 py-3 rounded-md">
  <h3 className="font-bold text-2xl cursor-default mt-[-5px] ">Signup-Form</h3>
</div>




<div className='mt-4 space-y-2'>
  <span>Full-Name</span>
  <br/>
  <input
  type='text'
  placeholder='Enter Full-Name'
  className='w-80 px-3 py-1 border border-orange-300 rounded-md outline-none dark:text-slate-900'{...register("fullname", { required: true })}/>
  <br/>
  {errors.fullname && <span className="text-sm text-red-500">This field is required</span>}
</div>


<div className='mt-4 space-y-2'>
  <span>Email</span>
  <br/>
  <input
  type='email'
  placeholder='Enter your email'
  className='w-80 px-3 py-1 border  border-orange-300 rounded-md outline-none dark:text-slate-900'{...register("email", { required: true })}/>
  <br/>
  {errors.email && <span className="text-sm text-red-500">This field is required</span>}
</div>


{/*<div className='mt-4 space-y-2'>
  <span>Password</span>
  <br/>
  <input
  type='password'
  placeholder='Enter Password'
  className='w-80 px-3 py-1 border  border-orange-300 rounded-md outline-none dark:text-slate-900'{...register("password", { required: true })}/>
  <br/>
  {errors.password && <span className="text-sm text-red-500">This field is required</span>}
</div>*/}
 
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



<div className='flex justify-around mt-8'>
    <button className='bg-purple-600 text-white rounded-md px-3 py-1 hover:bg-purple-800 duration-300 ml-[-20px]'>Signup</button>
    <p>
        Have account? {" "}
        <button className='underline text-blue-500 cursor-pointer'
        onClick={()=> document.getElementById("my_modal_jobseeker").showModal()}>Login</button>{" "}
        <Login_Jobseeker/>
    </p>
</div>
</form>
</div>
</div>
    </div>
    </>
  )
}


export default Signup_Jobseeker
