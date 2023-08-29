import React from 'react';
import dices from "../../img/dices.png";

/**
 * Shows a game board of all the players and their previous dices.
 */
const GameBoard = ({ players, playerInTurn  }) => {

  const splitIndex = players.length / 2;
  const playersTop = players.slice(0, splitIndex);
  const playersBottom = players.slice(splitIndex);

  return (
    <div className='mt-64 font-oswald text-xl'>
      <div className='pb-2 flex justify-between'>
        {
          playersTop.map(player => (
            <div className='flex'>
              <p className={`mr-1 ${player.username === playerInTurn.username ? "text-green-400" : "text-gray-200"}`}>{player.username}</p>
              <p>{player.inputDice1 > player.inputDice2 ? player.inputDice1 + "" + player.inputDice2 : player.inputDice2 + "" + player.inputDice1}</p>
            </div>
          ))
        }
      </div>
      
      <div className='bg-[#281F3C] w-[300px] shadow-xl h-[150px] rounded-l-full rounded-r-full flex justify-center items-center'>
        <div className={`flex justify-center items-center w-[95%] h-[90%] bg-[#FFD8D1] relative rounded-l-full rounded-r-full`}>
          <div className='flex justify-center items-center bg-[#A999FE] rounded-l-full rounded-r-full w-[93%] h-[85%]'>
            <div className='flex justify-center items-center bg-white rounded-l-full rounded-r-full w-[90%] h-[80%]'>
              <div className='flex justify-center items-center bg-[#A999FE] rounded-l-full rounded-r-full w-[99%] h-[97%]'>
                <img
                  src={dices}
                  className='opacity-100 w-[30%]'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='pb-2 flex flex-reverse justify-between'>
        {
          playersBottom.slice().reverse().map(player => (
            <div className='flex'>
              <p className={`mr-1 ${player.username === playerInTurn.username ? "text-green-400" : "text-gray-100"}`}>{player.username}</p>
              <p>{player.inputDice1 > player.inputDice2 ? player.inputDice1 + "" + player.inputDice2 : player.inputDice2 + "" + player.inputDice1}</p>
            </div>
          ))
        }
      </div>
    </div>
  )
};

export default GameBoard;