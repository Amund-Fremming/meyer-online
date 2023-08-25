import React from 'react';
import dices from "../../img/dices.png";

/**
 * Shows a game board of all the players and their previous dices.
 */
const GameBoard = ({ players, playerInTurn  }) => {

  return (
    <div className='bg-gray-800 w-[300px] h-[150px] rounded-l-full rounded-r-full flex justify-center items-center'>
      <div className='flex justify-center items-center w-[95%] h-[90%] bg-gray-500 relative rounded-l-full rounded-r-full'>
        <div className='flex justify-center items-center bg-[#A999FE] rounded-l-full rounded-r-full w-[93%] h-[85%]'>
  
          <div className='flex justify-center items-center bg-white rounded-l-full rounded-r-full w-[85%] h-[80%]'>
            <div className='bg-[#A999FE] rounded-l-full rounded-r-full w-[99%] h-[97%]'>

            </div>
          </div>
        
        </div>
      </div>
    </div>
  )
};

/*
  <img
    src={dices}
    className='opacity-80 w-[30%]'
  />
*/

export default GameBoard;
