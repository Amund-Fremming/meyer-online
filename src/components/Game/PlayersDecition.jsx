import React from 'react';

// Må legge til leave knapp øverst til venstre
// Lagre game state tilfelle rerender

/**
 * Component for players decitions in the game
 */
const PlayersDecition = ({ message, color, children }) => {
  return (
    <div className='flex opacity-100 bg-gradient-to-t from-[#281F3C] to-transparent flex-col justify-center items-center absolute bottom-0 h-[310px] w-full'>
        <h3 className={`text-${color} text-2xl font-oswald mb-10`}>{message}</h3>
        <div className='flex'>
          {children}
        </div>
    </div>
  )
;}

export default PlayersDecition;
