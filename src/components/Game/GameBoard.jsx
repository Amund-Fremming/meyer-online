import React from 'react';
import dices from "../../img/dices.png";

/**
 * Shows a game board of all the players and their previous dices.
 */
const GameBoard = ({ players, playerInTurn }) => {
  const radius = 150; // Adjust this value to change the distance from the center
  const center = 150; // Adjust this value to position the names accurately

  const getPosition = (index) => {
    const angle = (360 / players.length) * index;
    const radians = (angle * Math.PI) / 180;
    const x = center + radius * Math.cos(radians);
    const y = center + radius * Math.sin(radians);
    return { left: `${x}px`, top: `${y}px` };
  };

  return (
    <div className='bg-[#281F3C] w-[300px] shadow-xl h-[150px] mt-64 rounded-l-full rounded-r-full flex justify-center items-center'>
      <div className={`flex justify-center items-center w-[95%] h-[90%] bg-[#FFD8D1] relative rounded-l-full rounded-r-full`}>
        <div className='flex justify-center items-center bg-[#A999FE] rounded-l-full rounded-r-full w-[93%] h-[85%]'>
          <div className='flex justify-center items-center bg-white rounded-l-full rounded-r-full w-[90%] h-[80%]'>
            <div className='flex justify-center items-center bg-[#A999FE] rounded-l-full rounded-r-full w-[99%] h-[97%]'>
              <div className="player-names">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="player-name"
                    style={getPosition(index)}
                  >
                    {player.username}
                  </div>
                ))}
              </div>
              <img src={dices} className='opacity-100 w-[30%]' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
