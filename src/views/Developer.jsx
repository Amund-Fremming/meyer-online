import React, { useEffect, useState } from 'react';
import { handleLeaveGame } from '../util/databaseFunctions';
import mePixelImage from "../img/me-pixel.png";
import mePixelImageWink from "../img/me-pixel-wink.png";
import mePixelImageSunglasses from "../img/me-pixel-sunglasses.png";

/**
 * Short page about the developer and how to contact
 */
const Developer = ({ username, documentRef, resetGameState }) => {

  const [profile, setProfile] = useState(mePixelImage);
  const [timer, setTimer] = useState();
  const [message, setMessage] = useState("");

  /**
   * Timer for the image to make a wink effect.
   */
  useEffect(() => { setTimeout(() => setMessage("Click me!"), 6000) });

  useEffect(() => {
    const timer = setInterval(() => {
      if(profile === mePixelImage) {
        setProfile(mePixelImageWink);
      } else {
        setProfile(mePixelImage);
      }
    }, 1500);
    setTimer(timer);

    return () => clearInterval(timer);
  }, [profile]);

  const handleClick = () => {
    clearInterval(timer);
    setProfile(mePixelImageSunglasses);
  };

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
        onClick={handleClick} 
        className='w-[40%]'
        src={profile}
      />
      <p className='font-serif mt-1'>{message}</p>
      
      <div className='flex justify-between mt-20 w-[100px]'>
        <p className='underline underline-offset-2 text-[16px] font-serif'><a href='https://fremminglabs-portfolio.web.app/'>MySite</a></p>
        <p className='underline underline-offset-2 text-[16px] font-serif'><a href="mailto:amund.fremming@gmail.com">Mail</a></p>
      </div>

      <p className='flex relative bottom-[-220px] text-[16px] font-serif'> © 2023 FremmingLabs, Inc.</p>

    </div> 
  )
}

export default Developer
