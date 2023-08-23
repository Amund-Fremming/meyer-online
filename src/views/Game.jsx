import React, { useEffect, useState } from "react";
import { onSnapshot, runTransaction } from "firebase/firestore";
import PlayerTurn from "../components/Game/Playerturn";
import WaitingTurn from "../components/Game/WaitingTurn";
import GameBoard from "../components/Game/GameBoard"; 
import { db } from "../config/firebase";

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

    const handleLeaveGame = async () => {
        try {
            await runTransaction(db, async (transaction) => {
                const docSnapshot = await transaction.get(documentRef);
    
                if (!docSnapshot.exists()) {
                    throw new Error("Document does not exist!");
                }
    
                const currentPlayers = docSnapshot.data().players;
                const updatedPlayers = currentPlayers.filter(player => player.username !== username);
    
                transaction.update(documentRef, { players: updatedPlayers });
            });
    
            console.log(username + " left the game");
        } catch (err) {
            console.error("Error: " + err.message);
        }
    
        resetGameState();
    };    
    
    return(
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <h1>Game</h1>
                <h2>gameid: {gameid}</h2>
                <div className="m-2 p-1 bg-gray-200">
                    <h1 className="text-xl font-bold">Players</h1>
                    {
                        !players ? "" :
                        players.map(player => (
                            <p key={player.username}>{player.username} rolled dices: {player.inputDice1 > player.inputDice2 ? player.inputDice1 + "" + player.inputDice2 : player.inputDice2 + "" + player.inputDice1}</p>
                        ))
                    }
                </div>

                {/* Game board */}
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
                    />
                    : <WaitingTurn />
                }
                <button
                    className='p-1 bg-gray-200 m-1'
                    onClick={handleLeaveGame}
                >
                    Leave
                </button>   
            </div>
        </>
    );
};

export default Game;