import React from 'react';

/**
 * Header with the game name
 */
const Header = ({ mt, mb }) => {
  return (
    <div className={`flex flex-col items-center w-full mt-${mt} mb-${mb}`}>
        <h1 className="text-3xl pr-7 font-serif">MEYER</h1>
        <h1 className="text-3xl pl-7 font-serif">ONLINE</h1>
    </div>
  )
};

export default Header;
