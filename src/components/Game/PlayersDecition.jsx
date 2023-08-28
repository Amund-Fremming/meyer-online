import React from 'react';
import ChooseDices from './ChooseDices';

// Må legge til leave knapp øverst til venstre
// Lagre game state tilfelle rerender

/**
 * Component for players decitions in the game
 */
const PlayersDecition = ({ message, color, children, playersTurn }) => {
  return (
    <div className='flex opacity-100 bg-gradient-to-t from-[#281F3C] to-transparent flex-col justify-center items-center absolute bottom-0 h-[300px] w-full'>
        <h3 className={`text-${color} text-2xl font-oswald mb-4`}>{message}</h3>
        {playersTurn ? <ChooseDices/> : <></>}
        <div className='flex'>
          {children}
        </div>
    </div>
  )
;}

export default PlayersDecition;
