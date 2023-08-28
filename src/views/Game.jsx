import React, { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import PlayerTurn from "../components/Game/Playerturn";
import WaitingTurn from "../components/Game/WaitingTurn";
import GameBoard from "../components/Game/GameBoard"; 
import { handleLeaveGame } from "../util/databaseFunctions";
import Header from "../components/Universal/Header";

/**
 * The main game component, where the game is played
 */
const Game = ({ gameid, username, documentRef, saveInSessionStorage, resetGameState }) => {
    
    const [players, setPlayers] = useState([]);
    const [playersTurn, setPlayersTurn] = useState(false);
    const [game, setGame] = useState({});
    const [dice1, setDice1] = useState("");
    const [dice2, setDice2] = useState("");
    const [inputDice1, setInputDice1] = useState("");
    const [inputDice2, setInputDice2] = useState("");
    const [playerInTurn, setPlayerInTurn] = useState({});

    useEffect(() => {
        if(!documentRef) return;

        saveInSessionStorage(gameid, username, documentRef);

        const unsubscribe = onSnapshot(documentRef, snapshot => {
            if(!snapshot.data()) {
                console.log("Game deleted");
                alert("Game deleted");
                resetGameState();
                return;
            }

            setPlayerInTurn(snapshot.data().currentPlayer);
            setPlayersTurn(snapshot.data().currentPlayer.username === username);
            setPlayers(snapshot.data().players);
            setGame(snapshot.data());
        });
    
        return () => unsubscribe();
    }, [documentRef]);   
    

    return(
        <div
            className="min-h-screen bg-cover bg-center flex flex-col justify-start items-center h-screen w-full bg-gray-500" style={{ backgroundImage: `url('${require("../img/lake.png")}')`}}
        >
            <button
                className='p-1 shadow-xl m-1 absolute top-8 left-2 h-8 w-12 text-center rounded-md bg-[#A999FE] font-oswald'
                onClick={() => handleLeaveGame(username, documentRef, resetGameState)}
            >
                Leave
            </button>
            <Header /> 
            <GameBoard />
            {
                playersTurn ?
                <PlayerTurn
                    documentRef={documentRef}
                    username={username}
                    game={game}
                    dice1={dice1}
                    dice2={dice2}
                    setDice1={setDice1}
                    setDice2={setDice2}
                    inputDice1={inputDice1}
                    inputDice2={inputDice2}
                    setInputDice1={setInputDice1}
                    setInputDice2={setInputDice2}
                    playersTurn={playersTurn}
                    playerInTurn={playerInTurn}
                    resetGameState={resetGameState}
                /> :
                <WaitingTurn players={players} />
            }      
        </div>
    );
};

export default Game;