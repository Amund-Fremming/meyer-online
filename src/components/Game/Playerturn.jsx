import React, { useEffect, useState } from 'react'
import { runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { handleLeaveGame } from '../../util/databaseFunctions';

/**
 * Handles all the users choices when its their turn
 */
const PlayerTurn = ({ documentRef, username, game, dice1, setDice1, dice2, setDice2, inputDice1, setInputDice1, inputDice2, setInputDice2, playersTurn }) => {

  const [thrownDices, setThrownDices] = useState(false);
  const [tryBust, setTryBust] = useState(false);
  const [bustSuccess, setBustSuccess] = useState(false);
  const [inactiveCounter, setInactiveCounter] = useState(0);

  /**
   * This method will skip a player if he uses too long time. In order to update the game when a player is inactive handleThrowDices needs to have a callback to pass values to updateAllDices since the useEffect method is to slow for this update, resulting in the db not getting updated correct.
   */
  useEffect(() => {
    let timeout;
    const handleTimeout = async () => {
      if(inactiveCounter === 3) {
        handleLeaveGame(username, documentRef, resetGameState);
        updateNextPlayer();
      }

      const diceArray = handleThrowDices();
      await updateAllDices(diceArray[0], diceArray[1], true);
      await updateNextPlayer();
      setInactiveCounter(inactiveCounter + 1);
    };

    if(playersTurn) {
      timeout = setTimeout(handleTimeout, 10000);
    }

    return () => {
      clearTimeout(timeout);
    }
  }, [playersTurn, dice1, dice2]);

  /**
   * Handles the logic if a player thinks the previous player has cheated.
   */
  const handleBust = () => {
    const previousPlayer = game.previousPlayer;
    setTryBust(true);

    if(previousPlayer.inputDice1+"" !== previousPlayer.dice1+"" || previousPlayer.inputDice2+"" !== previousPlayer.dice2+"") {
      console.log("Previous player got BUSTED!");
      setBustSuccess(true);
      alertPlayerBusted();
    } else {
      console.log(`The BUST was false, player ${username} lost!`);
      setBustSuccess(false);
    } 
     
    resetGame();
  };

  /** 
   * Handles the throw dice mechanism
   */
  const handleThrowDices = (timeoutPlayer) => {
    // Play dice annimation
    const dice1Local = Math.floor(Math.random() * 6) + 1;
    const dice2Local = Math.floor(Math.random() * 6) + 1;

    if(timeoutPlayer) {
     setInputDice1(dice1Local);
     setInputDice2(dice2Local);
    }

    setDice1(dice1Local);
    setDice2(dice2Local);
    // Show lie or play dices to go futher in game logic
    setThrownDices(true);

    return [dice1Local, dice2Local];
  };

  const handleSubmitDices = () => {
    updateAllDices();
  };

  /**
   * Takes in the values the player decides that the dices are, we set the previousplayer dice values to the current player here, because the next turn the currentplayer becomes the previous. 
   */
  const updateAllDices = async (dice1Param, dice2Param, timedOutPlayer) => {

    if(timedOutPlayer) {
      dice1 = dice1Param;
      dice2 = dice2Param;
      inputDice1 = dice1Param;
      inputDice2 = dice2Param;
    }

    try {
      const updateDiceTransaction = async (transaction) => {
        const docSnapshot = await transaction.get(documentRef);
        if(!docSnapshot.exists) {
          throw new Error("Document does not exist!");
        }

        const updatedCurrentPlayer = {
          ...game.currentPlayer,
          dice1: dice1,
          dice2: dice2,
          inputDice1: inputDice1,
          inputDice2: inputDice2,
        }
  
        const updatedPlayers = game.players.map(player => {
          if(player.username === username) {
            return {
              ...player,
              dice1: dice1,
              dice2: dice2, 
              inputDice1: inputDice1,
              inputDice2: inputDice2,
            }
          }
          return player;
        });

        transaction.update(documentRef, {
          currentPlayer: updatedCurrentPlayer,
          players: updatedPlayers,
          previousPlayer: updatedCurrentPlayer
        });
      };  

      await runTransaction(db, updateDiceTransaction).then(async() => await updateNextPlayer());
    } catch(err) {
      console.log("Error: " + err.message);
    }
  };

  /**
   * Updates the next players turr, so the game continues
   */
  const updateNextPlayer = async () => {  
    try {
      const updateTransaction = async (transaction) => {
        const docSnapshot = await transaction.get(documentRef);
        if(!docSnapshot.exists) {
          throw new Error("Document does not exist!");
        }

        const previousPlayerIndex = game.players.findIndex(player => player.username === username);
        let currentPlayer;

        if(previousPlayerIndex === -1) {
          alert("player no longer exists");
          return;
        } else if(previousPlayerIndex === (game.players.length - 1)) {
          currentPlayer = game.players[0];
        } else {
          currentPlayer = game.players[(previousPlayerIndex + 1)];
        }

        transaction.update(documentRef, { currentPlayer: currentPlayer });
      };

      console.log("Updated next player");
      await runTransaction(db, updateTransaction);
    } catch (err) {
      console.log(err.message);
    }
  };

  /**
   * Resets the game so its ready for a new round
   */
  const resetGame = async () => {
    const updatedPlayers = game.players.map(player => {
      return {
        ...player,
        dice1: 0,
        dice2: 0,
        inputDice1: 0,
        inputDice2: 0,
      }
    });

    const updatedCurrentPlayer = {
      ...game.currentPlayer,
      dice1: 0,
      dice2: 0,
      inputDice1: 0,
      inputDice2: 0,
    };

    const updatedPreviousPlayer = {
      ...game.previousPlayer,
      dice1: 0,
      dice2: 0,
      inputDice1: 0,
      inputDice2: 0,
    };

    await updateDoc(documentRef, {
      currentPlayer: updatedCurrentPlayer,
      players: updatedPlayers,
      previousPlayer: updatedPreviousPlayer
    });
  };

  /**
   * Alerts the player that has been busted.
   */
  const alertPlayerBusted = () => {
    // Updates a players busted state, and shows them that they are busted and to all other players
    // Needs to edit db
  };

  if(!thrownDices) {
    return (
      <div className='flex flex-col justify-center items-center'>

        { tryBust ? <p>The bust was {bustSuccess ? "true" : "false"}</p> : <></> }

        <div>
          <button
            className='m-2 p-1 bg-gray-200'
            onClick={handleBust}
          >
            Bust
          </button>
          <button
            className='m-2 p-1 bg-gray-200'
            onClick={handleThrowDices}
          >
            Throw dice
          </button>
        </div>
      </div>
    )
  } else if(thrownDices) {
    return(
      <div className='flex flex-col justify-center items-center'>
        {/* Dices */}
        <p>Dice1: {dice1}</p>
        <p>Dice2: {dice2}</p>
        <input 
          type="number"
          className="p-1 m-1 bg-gray-200 w-12"
          onChange={e => setInputDice1(e.target.value)}
          placeholder='Dice 1'
          min={1} max={6}
        />
        <input 
          type="number"
          className="p-1 m-1 bg-gray-200 w-12"
          placeholder='Dice 2'
          onChange={e => setInputDice2(e.target.value)}
          min={1} max={6}
        />
        <button
          className='m-2 p-1 bg-gray-200'
          onClick={handleSubmitDices}
        >
          Play dices
        </button>
      </div>
    );
  };
};

export default PlayerTurn

