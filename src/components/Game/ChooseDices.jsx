import React from 'react';
import Dice from './Dice';

// HER MÅ ONLICK FIKSES SÅ DEN SETTER TO TERNING VERDIER
const ChooseDices = ({ setInputDice1, setInputDice2 }) => {

    const numDices = [1, 2, 3, 4, 5, 6];

    return (
        <div className='flex w-full justify-center items-center'>
            {
                numDices.map(dicenum => (
                    <div
                        key={dicenum}
                        className='flex flex-col'
                        onClick={() => console.log(dicenum)}    
                    >
                        <Dice val={dicenum} />
                    </div>
                ))
            }
        </div>
    );
};

export default ChooseDices;
