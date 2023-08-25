import React, { useEffect, useState } from 'react'
import { runTransaction, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { handleLeaveGame } from '../../util/databaseFunctions';

// MÅ lagre gamestate så man ikke kan slå terning på nytt på hver rerender

/**
 * Handles all the users choices when its their turn
 */
const PlayerTurn = ({ documentRef, username, dice1, setDice1, dice2, setDice2, inputDice1, setInputDice1, inputDice2, setInputDice2, playersTurn, resetGameState, inactiveCounter, setInactiveCounter }) => {

  const [thrownDices, setThrownDices] = useState(false);
  const [tryBust, setTryBust] = useState(false);
  const [bustSuccess, setBustSuccess] = useState(false);
  const [game, setGame] = useState({});

  useEffect(() => {
    if(!documentRef) return;

    const unsubscribe = onSnapshot(documentRef, snapshot => {
        if(!snapshot.data()) {
            console.log("Game deleted");
            alert("Game deleted");
            resetGameState();
            return;
        }

        setGame(snapshot.data());
    });

    return () => unsubscribe();
  }, [documentRef]);

  /**
   * This method will skip a player if he uses too long time. In order to update the game when a player is inactive handleThrowDices needs to have a callback to pass values to updateAllDices since the useEffect method is to slow for this update, resulting in the db not getting updated correct.
   */
  useEffect(() => {
    let timeout;
    const handleTimeout = async () => {
      console.log(inactiveCounter);
      if(inactiveCounter === 3) {
        handleLeaveGame(username, documentRef, resetGameState);
        updateNextPlayer();
      }

      const diceArray = handleThrowDices();
      await updateAllDices(diceArray[0], diceArray[1], true);
      await updateNextPlayer();
      setInactiveCounter(prevInactiveCounter => prevInactiveCounter + 1);
    };

    if(playersTurn) {
      timeout = setTimeout(handleTimeout, 300000);
    }

    return () => {
      clearTimeout(timeout);
    }
  }, [playersTurn, dice1, dice2]);

  /**
   * Handles the logic if a player thinks the previous player has cheated.
   */
  const handleBust = async () => {
    const gameData = await fetchGameData();
    setTryBust(true);

    if(gameData.previousPlayer.inputDice1+"" !== gameData.previousPlayer.dice1+"" || gameData.previousPlayer.inputDice2+"" !== gameData.previousPlayer.dice2+"") {
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
    setThrownDices(true);

    return [dice1Local, dice2Local];
  };

  const fetchGameData = async () => {
    try {
      const gameData = await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(documentRef);
        if (!snapshot.exists) {
          throw new Error("Document does not exist!");
        }
        return snapshot.data();
      });
  
      return gameData;
    } catch (err) {
      console.log("Error fetching game data: " + err.message);
    }
  };  

  /**
   * This method updates the dices, then updates the next player
   */
  const handleSubmitDices = async () => {
    await updateAllDices("0", "0", false);
    const gameData = await fetchGameData();

    const hasImproved = await hasScoreImproved(gameData);

    if(hasImproved) {
      alert("Your score is good!");
      await updateNextPlayer();  
    } else {
      // If loss, alert player, make him hit ok, then update next player
      alert("Your score is too low, you loose");
      resetGame();
    }
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
          // previousPlayer: updatedCurrentPlayer
        });
      };  

      await runTransaction(db, updateDiceTransaction);
    } catch(err) {
      console.log("Error: " + err.message);
    }
    console.log("Player dices updated");
  };

  /**
   * Updates the next players turr, so the game continues
   */
  const updateNextPlayer = async () => {  
    setDice1("");
    setDice2("");
    setInputDice1("");
    setInputDice2("");

    const gameData = await fetchGameData();

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

        transaction.update(documentRef, {
          currentPlayer: currentPlayer,
          previousPlayer: gameData.players[previousPlayerIndex],
        });
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

    setDice1("");
    setDice2("");
    setInputDice1("");
    setInputDice2("");
    setThrownDices(false);
  };

  /**
   * Checks if the current player beat or tied the score to the previous player
   */
  const hasScoreImproved = async (gameData) => {
    const previousPlayerIntegerScore = diceValueToIndex(gameData.previousPlayer.inputDice1, gameData.previousPlayer.inputDice2);
    const currentPlayerIntegerScore = diceValueToIndex(gameData.currentPlayer.inputDice1, gameData.currentPlayer.inputDice2);

    if(previousPlayerIntegerScore[0] > currentPlayerIntegerScore[0]) {
      return false;
    }

    return true;
  };

  const diceValueToIndex = (dice1, dice2) => {
    const dices = dice1 > dice2 ? dice1 + "" + dice2 : dice2 + "" + dice1;
    switch (dices) {
      case "21":
          return [20, "MEYER"];
      case "31":
          return [19, "SMALL MEYER"];

      case "66":
          return [18, "PAIR"];
      case "55":
          return [17, "PAIR"];
      case "44":
          return [16, "PAIR"];
      case "33":
          return [15, "PAIR"];
      case "22":
          return [14, "PAIR"];
      case "11":
          return [13, "PAIR"];

      case "65":
          return [12, "VALUE"];
      case "64":
          return [11, "VALUE"];
      case "63":
          return [10, "VALUE"];
      case "62":
          return [9, "VALUE"];
      case "61":
          return [8, "VALUE"];
      case "54":
          return [7, "VALUE"];
      case "53":
          return [6, "VALUE"];
      case "52":
          return [5, "VALUE"];
      case "51":
          return [4, "VALUE"];
      case "43":
          return [3, "VALUE"];
      case "42":
          return [2, "VALUE"];
      case "41":
          return [1, "VALUE"];
      case "32":
          return [0, "VALUE"];
      default:
          return [0, "UNKNOWN"];
    }
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
            onClick={() => handleThrowDices(false)}
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
          value={inputDice1}
          min={1} max={6}
        />
        <input 
          type="number"
          className="p-1 m-1 bg-gray-200 w-12"
          placeholder='Dice 2'
          onChange={e => setInputDice2(e.target.value)}
          value={inputDice2}
          min={1} max={6}
        />
        <button
          className='m-2 p-1 bg-gray-200'
          onClick={handleSubmitDices}
        >
          Play dices
        </button>
        <button
          className='m-2 p-1 bg-gray-200'
          onClick={updateNextPlayer}
        >
          nextPlayer
        </button>
      </div>
    );
  }
};

export default PlayerTurn

