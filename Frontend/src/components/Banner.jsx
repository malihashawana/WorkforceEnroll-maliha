import React from 'react';
import banner from "../../public/Banner.jpg";

function Banner() {
  return (
    <>
    <div className='max-w-screen-2xl container mx-auto md:px-10 px-4 flex md:flex-row my-20'>
      <div className='w-1/2  md:w-1/2 mt-12 md:mt-32 pr-8'>
      <div className='space-y-12'>
      <h1 className='text-4xl font-bold'>YOUR DREAM JOB IS WAITING FOR <span className='text-blue-400'>YOU!!!
      </span>
      </h1>
      <p className="text-xl">
      Experience the future of job hunting with our intelligent platform, offering real-time updates, detailed company insights, and career growth tools.
      </p>
      
      <label className="input input-bordered flex items-center gap-2">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path
      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
  </svg>
  <input type="text" className="grow px-2" placeholder="Email" />
</label>
</div>

<button className="btn mt-4  bg-blue-500 text-white">Get Started</button>
      </div>
      <div className=' w-full md:w-1/2 pt-16 md:pt-32'>
      <img src={banner} className="w-100 h-100" alt=""/>
      </div>
    </div>
    
    </>
  )
}

export default Banner