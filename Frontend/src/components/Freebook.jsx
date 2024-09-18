import React, { useEffect, useState } from 'react';
//import list from "../../public/list.json";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Card from './Card';
import axios from "axios";
function Freebook() {
  const[book,setBook]=useState([]);
  useEffect(()=>{
    const getBook=async()=>{
      try{
        const res=await axios.get("http://localhost:4001/book");
        
        const data=res.data.filter((data) => data.category === "Free")
        console.log(data);
        setBook(data);

      }catch (error){
        console.log(error);
      }

    };
    getBook();

},[]);
  
  //const filterData = list.filter((data) => data.category === "Free");
  //console.log(filterData); // Debugging output

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
    {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
      
    ],
  };

  return (
    
      <div className='max-w-screen-2xl container mx-auto md:px-1 py-3  dark:bg-slate-900 dark:text-white'>
        <div>
          <h1 className='font-bold text-xl pb-2'>Some free books for you!</h1>
          <p>
            Within the pages of a storybook, the mind finds its sanctuary, where every tale whispered to the soul is a gentle breeze that rejuvenates the spirit and nurtures the imagination.
          </p>
          </div>
        
        <div className="slider-container">
        <Slider {...settings}>
            {book.map((item) => (
              <Card item={item} key={item.id} />
            ))}
          </Slider>
          
        </div>
        </div>
      
    
  );
}

export default Freebook;
