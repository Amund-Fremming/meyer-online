import React from 'react';

/**
 * Shows all the players
 */
const Players = ({ players }) => {
  return (
    <div className="absolute top-40 w-[90%] flex flex-wrap justify-center items-center">
        {players.map(player => (<p className={`mx-2 px-2 my-2 ${player.ready ? "text-green-400" : "text-red-400"} bg-gray-200 bg-opacity-20 p-1 text-center rounded-md font-roboto text-xl`} key={player.username}>{player.username}</p>))}
    </div>
  )
};

export default Players;
