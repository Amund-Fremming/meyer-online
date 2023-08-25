import React from 'react';
import NavButton from '../Universal/NavButton';
import { handleLeaveGame } from '../../util/databaseFunctions';

// Må legge til leave knapp øverst til venstre
// Lagre game state tilfelle rerender

/**
 * Component for players decitions in the game
 */
const PlayersDecition = ({ message, color, gameid, username, documentRef }) => {
  return (
    <div className='flex flex-col justify-center items-center absolute bottom-0 h-[200px] bg-[#281F3C] w-full'>
        <h3 className={`text-${color} text-2xl font-oswald mb-10`}>{message}</h3>
        <div className='flex'>
            <NavButton text="Bust" />
            <NavButton  text="Trow dices" />
        </div>
    </div>
  )
}

export default PlayersDecition;
