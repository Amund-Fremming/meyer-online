import React from 'react'
import PlayersDecition from "./PlayersDecition";

/**
 * Handles all the users waiting turn.
 */
const WaitingTurn = ({ players }) => {

  // Players må oppdatere person som blir busted med rød skrift, og så fjerne denne med en timer

  return (
    <>
      <PlayersDecition message="Waiting for your turn..." color="green-400" waiting={true} >
      </PlayersDecition>
    </>
  )
};

export default WaitingTurn
