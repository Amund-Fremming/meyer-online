import React from "react";

/**
 * Shows the user how the game is played
 */
const Tutorial = () => {
    return(
        <>
            Tutorial
        </>
    );
};

export default Tutorial;

/*
    GAMEPLAY
    1. The starting player rolls the dice secretly, keeping the result hidden from other players
    2. To pass the round the player needs to score higher than the player before
    3. The player then anonounces what dices he got without showing his dices, the player can also decide to lie if he gets a low dice number 
    4. The turn passes to the next player clockwise
    5. When its your turn you have the choice to BUST, this means that you dont believe the last players dice scores, and think they are lying. If the player before lied we win, if not we loose.

    Dice Score Hierarki
    1. Meyer: 21
    2. Small Meyer: 31
    3. Pairs going from 6 to 1
    4. scores going down from 65 to 32

    if a player gets 32, Everybody drinks!

    GAME END
    The game ends when players dont want to drink anymore

    TUTORIAL WITH IMAGES OR VIDEO???

 */