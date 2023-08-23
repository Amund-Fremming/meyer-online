import React, { useEffect, useState } from 'react';
import { handleLeaveGame } from '../util/databaseFunctions';

const Developer = ({ username, documentRef, resetGameState }) => {

  const [profile, setProfile] = useState("me-pixel.JPG");

  useEffect(() => {
    const timer = setInterval(() => {
      if(profile === "me-pixel.JPG") {
        setProfile("me-pixel-wink.JPG");
      } else {
        setProfile("me-pixel.JPG");
      }
    }, 1500);

    return () => clearInterval(timer);
  });

  return (
    <div className='flex flex-col justify-center items-center h-screen w-full'>

      <div className='absolute top-8 left-2'>
        <button
          className='m-2 p-2 font-serif bg-gray-300'
          onClick={() => handleLeaveGame(username, documentRef, resetGameState)}
        >
          Back
        </button>
      </div>

      <p className='font-bradford text-[18px] font-serif'>Amund Fremming</p>
      <p className='text-gray-400 font-serif'>Engineer & CEO</p>
      <img 
        className='w-[40%]'
        src={require(`../img/${profile}`)}
      />
      
      <div className='flex justify-between mt-20 w-[100px]'>
        <p className='underline underline-offset-2 text-[18px] font-serif'><a href='https://twitter.com/amundfremming'>X</a></p>
        <p className='underline underline-offset-2 text-[18px] font-serif'><a href="mailto:amund.fremming@gmail.com">Mail</a></p>
      </div>

      <p className='flex relative bottom-[-220px] text-[16px] font-serif'> © 2023 FremmingLabs, Inc.</p>

    </div>
  )
}

export default Developer
