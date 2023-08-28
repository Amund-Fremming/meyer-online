import React from 'react';
import Dice from './Dice';

const ChooseDices = ({ setInputDice1, setInputDice2 }) => {

    const makeDices = () => {
        for(let i = 1; i < 7; i++) {
            return(
                <div
                    className='flex flex-col'
                    onClick={""}    
                >
                    <Dice val={i} />
                </div>
            );
        }
    }

  return (
    <div className='flex'>
        { makeDices() }
    </div>
  )
}

export default ChooseDices
