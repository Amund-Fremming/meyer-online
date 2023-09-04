import React from 'react';

/**
 * Header with the game name
 */
const Header = ({ top, bottom, gameMessage }) => {
  return (
    <div className={`absolute flex flex-col top-20 items-center justify-start w-full top-${top} bottom-${bottom}`}>
        <h1 className="text-3xl pr-7 font-serif">MEYER</h1>
        <h1 className="text-3xl pl-7 font-serif">ONLINE</h1>
        <p className='mx-6 font-serif text-2xl pt-8 text-orange-400 text-center'>{gameMessage}</p>
    </div>
  )
};

export default Header;
