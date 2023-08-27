import React, { useEffect, useState } from 'react'
import { runTransaction, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { handleLeaveGame } from '../../util/databaseFunctions';
import PlayersDecition from './PlayersDecition';
import NavButton from '../Universal/NavButton';
import Dice from './Dice';

/**
 * Handles all the users choices when its their turn
 */
const PlayerTurn = ({ documentRef, username, dice1, setDice1, dice2, setDice2, inputDice1, setInputDice1, inputDice2, setInputDice2, playersTurn, resetGameState, inactiveCounter, setInactiveCounter }) => {

  const savePlayerturnSession = () => {
    // save thrownDices
    // save tryBust
    // save bustSuccess
    // save diceComponent1
    // save DiceComponent2
    // save playedDices
    // save diceScoreMessage
    // save diceScoreColor
    // game reset
  };

  const [thrownDices, setThrownDices] = useState(false);
  const [tryBust, setTryBust] = useState(false);
  const [bustSuccess, setBustSuccess] = useState(false);
  const [game, setGame] = useState({});
  const [playedDices, setPlayedDices] = useState(false);
  const [diceComponent1, setDiceComponent1] = useState();
  const [diceComponent2, setDiceComponent2] = useState();
  const [diceScoreMessage, setDiceScoreMessage] = useState("");
  const [diceScoreColor, setDiceScoreColor] = useState("");

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

  // ØDELAGT
  /*
  useEffect(() => {
    let timeout;
    const handleTimeout = async () => {
      if(inactiveCounter === 10) {
        await handleLeaveGame(username, documentRef, resetGameState);
        await updateNextPlayer();
        return;
      }

      const diceArray = handleThrowDices(true);
      await handleSubmitDices(diceArray[0], diceArray[1], true);
      await updateNextPlayer();
      setInactiveCounter(prevInactiveCounter => prevInactiveCounter + 1);
    };

    if(playersTurn) {
      timeout = setTimeout(handleTimeout, 6000);
    }

    return () => {
      clearTimeout(timeout);
    }
    
  }, [playersTurn, dice1, dice2]);
  /*

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
    
    resetGame(false);
  };

  /** 
   * Handles the throw dice mechanism
   */
  const handleThrowDices = (timeoutPlayer) => {
    // Play dice annimation
    const dice1Local = Math.floor(Math.random() * 6) + 1;
    const dice2Local = Math.floor(Math.random() * 6) + 1;

    setDiceComponent1(<Dice val={dice1Local} />);
    setDiceComponent2(<Dice val={dice2Local}/>);

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
  const handleSubmitDices = async (dice1param, dice2param, timedOutPlayer) => {
    await updateAllDices(dice1param, dice2param, timedOutPlayer);
    const gameData = await fetchGameData();

    const hasImproved = await hasScoreImproved(gameData);

    if(hasImproved) {
      setDiceScoreMessage("Your score passed!");
      setDiceScoreColor("green-400");
    } else {
      setDiceScoreMessage("Score too low, you lost!");
      setDiceScoreColor("red-400");
      resetGame(false);
    }

    setPlayedDices(true);
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

        const previousPlayerIndex = gameData.players.findIndex(player => player.username === username);
        let currentPlayer;

        if(previousPlayerIndex === -1) {
          alert("player no longer exists");
          return;
        } else if(previousPlayerIndex === (gameData.players.length - 1)) {
          currentPlayer = gameData.players[0];
        } else {
          currentPlayer = gameData.players[(previousPlayerIndex + 1)];
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
  const resetGame = async (fullReset) => {
    const gameData = await fetchGameData();

    const updatedPlayers = gameData.players.map(player => {
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

    if(fullReset) {
      setDice1("");
      setDice2("");
      setInputDice1("");
      setInputDice2(""); 

      setThrownDices(false);
      setTryBust(false);
      setBustSuccess(false);
      setPlayedDices(false);
      setDiceComponent1({});
      setDiceComponent2({});
    }
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

  if(!thrownDices && !tryBust) { // Initial load
    // Her må man lagre gamestate slik at på frefrsh så blir man ikke satt tilbake til starten
    return(
      <PlayersDecition message="Bust prevoius player or play dices!" color="green-400">
        <NavButton text="Bust" onClickFunction={handleBust} />
        <NavButton text="Trow dices" onClickFunction={() => handleThrowDices(false)} />
      </PlayersDecition>
    );
  } else if(!thrownDices && tryBust) { // Player tried to bust
    return(
      <PlayersDecition message={bustSuccess ? `You busted ${game.previousPlayer.username}` : "Your bust failed"} color={bustSuccess ? "green-400" : "red-400"}>
        <NavButton text="Throw dices" onClickFunction={() => handleThrowDices(false)} />
      </PlayersDecition>
    );
  } else if(thrownDices && !playedDices) { // Player have trown dices
    return(
      <>
        <div className='flex'>
          {diceComponent1}
          {diceComponent2}
        </div>
        <PlayersDecition message="Lie or play your two dices" color="green-400">
          <NavButton text="Play dices" onClickFunction={() => handleSubmitDices("0", "0", false)}/>
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
        </PlayersDecition>
      </>
    );
  } else if(thrownDices && playedDices) {
    return(
      <PlayersDecition message={diceScoreMessage} color={diceScoreColor}>
        <NavButton text="Next player" onClickFunction={async() => {
          await updateNextPlayer(true); 
      }}/>
      </PlayersDecition>
    );
  }
};

export default PlayerTurn

