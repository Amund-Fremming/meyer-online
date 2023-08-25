import React from 'react';

// Må legge til leave knapp øverst til venstre
// Lagre game state tilfelle rerender

/**
 * Component for players decitions in the game
 */
const PlayersDecition = ({ message, color, children }) => {
  return (
    <div className='flex flex-col justify-center items-center absolute bottom-0 h-[200px] bg-[#281F3C] w-full'>
        <h3 className={`text-${color} text-2xl font-oswald mb-10`}>{message}</h3>
        <div className='flex'>
          {children}
        </div>
    </div>
  )
}

export default PlayersDecition;
