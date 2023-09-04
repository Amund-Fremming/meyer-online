import React from 'react';
import ChooseDices from './ChooseDices';


/**
 * Component for players decitions in the game
 */
const PlayersDecition = ({ message, color, children }) => {
  return (
    <div className='flex opacity-100 bg-gradient-to-t from-[#281F3C] to-transparent flex-col justify-center items-center mt-20 h-[300px] w-full'>
        <h3 className={`text-${color} text-2xl font-oswald mb-4`}>{message}</h3>
        <div className='flex flex-col justify-center items-center'>
          {children}
        </div>
    </div>
  )
;}

export default PlayersDecition;
