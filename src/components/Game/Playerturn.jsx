import React, { useEffect, useState } from 'react'
import { runTransaction, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { handleLeaveGame } from '../../util/databaseFunctions';
import PlayersDecition from './PlayersDecition';
import NavButton from '../Universal/NavButton';
import Dice from './Dice';
import ChooseDices from './ChooseDices';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

/**
 * Handles all the users choices when its their turn
 */
const PlayerTurn = ({ documentRef, username, dice1, setDice1, dice2, setDice2, inputDice1, setInputDice1, inputDice2, setInputDice2, playersTurn, resetGameState, updateGameMessage }) => {

  const [thrownDices, setThrownDices] = useState(false);
  const [tryBust, setTryBust] = useState(false);
  const [bustSuccess, setBustSuccess] = useState(false);
  const [game, setGame] = useState({});
  const [playedDices, setPlayedDices] = useState(false);
  const [diceComponent1, setDiceComponent1] = useState();
  const [diceComponent2, setDiceComponent2] = useState();
  const [diceScoreMessage, setDiceScoreMessage] = useState("");
  const [diceScoreColor, setDiceScoreColor] = useState("");
  const [playermessage, setPlayerMessage] = useState("");

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

  useEffect(() => {
    let timeout;
    const handleTimeout = async () => {
      await updateGameMessage(`${username}, timed out!`);
      await updateNextPlayer();
      await handleLeaveGame(username, documentRef, resetGameState);
      alert("Inactive for too long");
    };

    if(playersTurn) {
      timeout = setTimeout(handleTimeout, 20000);
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

    const dicesValid = (gameData.previousPlayer.inputDice1+"" === gameData.previousPlayer.dice1+"" && gameData.previousPlayer.inputDice2+"" === gameData.previousPlayer.dice2+"");

    const dicesValidCross = (gameData.previousPlayer.inputDice1+"" === gameData.previousPlayer.dice2+"" && gameData.previousPlayer.inputDice2+"" === gameData.previousPlayer.dice1+"");

    if(dicesValid || dicesValidCross) {
      console.log(`The BUST was false, player ${username} lost!`);
      setBustSuccess(false);
      await updateGameMessage(`${username} tried to bust ${game.previousPlayer.username}, but FAILED!`)
    } else {
      console.log("Previous player got BUSTED!");
      setBustSuccess(true);
      await updateGameMessage(`${username} tried to bust ${game.previousPlayer.username}, SUCCEEDED!`)
    } 
  
    resetGame(false);
  };

  /** 
   * Handles the throw dice mechanism
   */
  const handleThrowDices = (timeoutPlayer) => {
    const dice1Local = Math.floor(Math.random() * 6) + 1;
    const dice2Local = Math.floor(Math.random() * 6) + 1;

    setDiceComponent1(<Dice val={dice1Local} toggle={true} />);
    setDiceComponent2(<Dice val={dice2Local} toggle={true} />);

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

    console.log("1: " + inputDice1 + " I2: " + inputDice2);
    if(inputDice1 === "" || inputDice2 === "" || inputDice1 === undefined || inputDice2 === undefined) {
      setPlayerMessage("Choose two dices!");
      return;
    }

    const hasImproved = await hasScoreImproved(gameData);

    if(hasImproved) {
      setDiceScoreMessage("Your score passed!");
      setDiceScoreColor("green-400");

      // SET PLAYER.STATUS = "PASSED"
    } else {
      setDiceScoreMessage("Score too low, you lost!");
      await updateGameMessage(`${username} lost the round!`);
      setDiceScoreColor("red-400");
      resetGame(false);

      // SET PLAYER.STATUS = "LOSS"
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

    await updateGameMessage("");
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

  if(!thrownDices && !tryBust) { // Initial load
    // Her må man lagre gamestate slik at på frefrsh så blir man ikke satt tilbake til starten
    return(
      <PlayersDecition message="Bust prevoius player or play dices!" color="green-400">
        <div className='flex'>
          <NavButton text="Bust" onClickFunction={async() => await handleBust()} />
          <NavButton text="Trow dices" onClickFunction={() => handleThrowDices(false)} />
        </div>
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
        <PlayersDecition message="" color="green-400" playersTurn={true}>
          <p className='font-oswald text-2xl text-white'>{playermessage}</p>
          <div className='flex text-green-400 items-center justify-center text-2xl'>
            <FaArrowRight />
            {diceComponent1}
            {diceComponent2}
            <FaArrowLeft />
          </div>
          <h2 className='text-xl font-oswald m-2 text-green-400'>Choose:</h2>
          <ChooseDices 
            setInputDice1={setInputDice1}
            setInputDice2={setInputDice2}
          />
          <div className='mb-2' />
          <NavButton text="Play dices" onClickFunction={async() => await handleSubmitDices("0", "0", false)}/>
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

