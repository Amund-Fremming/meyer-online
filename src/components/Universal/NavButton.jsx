import React from 'react';
import { styles } from '../../styles/styles';

/**
 * Navigation buttons
 */
const NavButton = ({ text, onClickFunction }) => {
  return (
    <button
        className={`m-2 w-[120px] h-[45px] bg-[#A999FE] rounded-xl text-xl text-[${styles.textcolor}] font-oswald`}
        onClick={onClickFunction}
    >
        {text}
    </button>
  )
};

export default NavButton;
