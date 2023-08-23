import React, { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import PlayerTurn from "../components/Game/Playerturn";
import WaitingTurn from "../components/Game/WaitingTurn";
import GameBoard from "../components/Game/GameBoard"; 
import { handleLeaveGame } from "../util/databaseFunctions";

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
    const [inactiveCounter, setInactiveCounter] = useState(0);

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
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <h1>Game</h1>
                <h2>gameid: {gameid}</h2>
                <div className="m-2 p-1 bg-gray-200">
                    <h1 className="text-xl font-bold">Players</h1>
                    {
                        players.map(player => (
                            <p key={player.username}>{player.username} rolled dices: {player.inputDice1 > player.inputDice2 ? player.inputDice1 + "" + player.inputDice2 : player.inputDice2 + "" + player.inputDice1}</p>
                        ))
                    }
                </div>

                <GameBoard
                    players={players}
                    playerInTurn={playerInTurn}
                />
                
                {/* Game logic */}
                {
                    playersTurn
                    ? <PlayerTurn 
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
                        inactiveCounter={inactiveCounter}
                        resetGameState={resetGameState}
                        setInactiveCounter={setInactiveCounter}
                    />
                    : <WaitingTurn />
                }
                <button
                    className='p-1 bg-gray-200 m-1'
                    onClick={() => handleLeaveGame(username, documentRef, resetGameState)}
                >
                    Leave
                </button>   
            </div>
        </>
    );
};

export default Game;
