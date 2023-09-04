import React from "react";
import howTo1 from "../img/howToImages/howTo1.png";
import howTo2 from "../img/howToImages/howTo2.png";
import howTo3 from "../img/howToImages/howTo3.png";
import howTo4 from "../img/howToImages/howTo4.png";
import howTo5 from "../img/howToImages/howTo5.png";
import howTo6 from "../img/howToImages/howTo6.png";
import howTo7 from "../img/howToImages/howTo7.png";
import { handleLeaveGame } from "../util/databaseFunctions";

/**
 * Shows the user how the game is played
 */
const Tutorial = ({ resetGameState }) => {
 
    const images = [howTo1, howTo2, howTo3, howTo4, howTo5, howTo6, howTo7];
    document.body.style.backgroundColor = "#F1F5F9";

    return(
        <div className="flex flex-col justify-center items-center">

            <div className='absolute top-8 left-2'>
                <button
                className='m-2 p-2 font-serif bg-gray-300'
                onClick={resetGameState}
                >
                Back
                </button>
            </div>

            <h1 className="font-serif mt-16 underline underline-offset-2 text-2xl mb-2">Gameplay</h1>
            <ol className="font-serif text-xs p-1 w-[300px] list-decimal">
                <li className="py-1">The starting player rolls the dice secretly, keeping the result hidden from other players</li>
                <li className="py-1">To pass the round the player needs to score higher than the player before</li>
                <li className="py-1">The player then anonounces what dices he got without showing his dices, the player can also decide to lie if he gets a low dice number</li>
                <li className="py-1">The turn passes to the next player clockwise</li>
                <li className="py-1">When its your turn you have the choice to BUST, this means that you dont believe the last players dice scores, and think they are lying. If the player before lied you win, if not you loose.</li>
            </ol>

            <h1 className="font-serif mt-8 underline underline-offset-2 text-xl mb-2">Dice Hierarki</h1>
            <ol className="font-serif text-xs p-1 w-[300px] list-decimal">
                <li className="py-1">Meyer: 21</li>
                <li className="py-1">Small Meyer: 31</li>
                <li className="py-1">Pairs from 6 to 1</li>
                <li className="py-1">Values from 65 to 32</li>
                <li className="py-1">If someone scores 32, everybody drinks!</li>
            </ol>

            <div className="flex flex-col items-center justify-center mx-6 my-4">
                <h1 className="font-serif mt-8 underline underline-offset-2 text-xl mb-2">Game Flow</h1>
                {images.map(image => (
                    <img key={image} src={image} />
                ))}
            </div>
        </div>
    );
};

export default Tutorial;

/*
   
    1. Meyer: 21
    2. Small Meyer: 31
    3. Pairs going from 6 to 1
    4. scores going down from 65 to 32
    5. if a player gets 32, Everybody drinks!
 */