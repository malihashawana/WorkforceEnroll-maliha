import React from 'react';

function Card({item}) {
  //console.log(item); // Debugging output
  return (
  
    <>
    <div className='mt-6 my-3 p-3'>
    
    <div className="card bg-base-100 w-92 shadow-xl hover:scale-105 duration-200 dark:bg-slate-900 dark:text-white dark:border">
      <figure>
        <img
          src= {item.image}
          alt= "Book"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
            
        {item.name}
          <div className="badge badge-secondary">{item.category}</div>
        </h2>
        <p>{item.title}</p>
        <div className="card-actions justify-between">
          <div className="badge badge-outline  hover:text-blue-500 bg-pink-400">Bdt:{item.price}.0</div>
          <div className="badge badge-outline text-black hover:text-blue-500 bg-pink-400">Start-Reading</div>
        </div>
      </div>
      </div>
    </div>
    </>
  )
}

export default Card;
