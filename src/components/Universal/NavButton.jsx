import React from 'react';
import { styles } from '../../styles/styles';

/**
 * Navigation buttons
 */
const NavButton = ({ text, onClickFunction}) => {
  return (
    <button
        className={`m-2 w-[120px] h-[45px] bg-[#A999FE] rounded-xl cursor-pointer active:translate-y-2  text-xl text-[${styles.textcolor}] font-oswald transition-all duration-150 [box-shadow:0_10px_0_0_#1b6ff8,0_15px_0_0_#1b70f841]
        border-b-[1px] border-blue-400`}
        onClick={onClickFunction}
    >
        {text}
    </button>
  )
};

export default NavButton;
