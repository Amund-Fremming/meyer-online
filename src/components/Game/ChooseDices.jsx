import React, { useState } from 'react';
import Dice from './Dice';

const ChooseDices = ({ setInputDice1, setInputDice2 }) => {

    const numDices = [1, 2, 3, 4, 5, 6];
    const [dicesSelected, setDicesSelected] = useState([]);

    const [toggle1, setToggle1] = useState(false);
    const [toggle2, setToggle2] = useState(false);
    const [toggle3, setToggle3] = useState(false);
    const [toggle4, setToggle4] = useState(false);
    const [toggle5, setToggle5] = useState(false);
    const [toggle6, setToggle6] = useState(false);

    const toggleArr = [toggle1, toggle2, toggle3, toggle4, toggle5, toggle6];
    const setToggleArr = [setToggle1, setToggle2, setToggle3, setToggle4, setToggle5, setToggle6];

    const handleClick = (dicenum) => {

        if(dicesSelected.length == 2) {
            const dicePop = dicesSelected.pop();
            setToggleArr[dicePop - 1](false);

            dicesSelected[1] = dicesSelected[0];
            dicesSelected[0] = dicenum;

            setToggleArr[dicesSelected[0] - 1](true);
            setToggleArr[dicesSelected[1] - 1](true);
        } else {
            dicesSelected.push(dicenum);
            setToggleArr[dicesSelected[0] - 1](true);
        }

        setInputDice1(dicesSelected[0]);
        setInputDice2(dicesSelected[1]);

    };

    return (
        <div className='flex w-full justify-center items-center'>
            {
                numDices.map(dicenum => (
                    <div
                        key={dicenum}
                        className='flex flex-col justify-center items-center'
                        onClick={() => handleClick(dicenum)}    
                    >
                        <Dice val={dicenum} toggle={toggleArr[dicenum-1]} />
                        <p className='font-oswald text-red-400'>{dicesSelected[0] === dicenum && dicesSelected[1] === dicenum ? "2x" : ""}</p>
                        
                    </div>
                ))
            }
        </div>
    );
};

export default ChooseDices;
