import React, { useEffect, useState } from "react";
import { onSnapshot, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { handleLeaveGame } from "../util/databaseFunctions";
import { styles } from "../styles/styles";

/**
 * GameLobby: Renders when the host starts the game with a "Waiting" state.
 * Allows users to ready up, displaying all player names, changing colors when ready.
 */
const GameLobby = ({ resetGameState, gameid, username, setView, documentRef, saveInSessionStorage }) => {

    const [players, setPlayers] = useState([]);
    const [isReady, setIsReady] = useState(false);

    /**
     * Subscribes a listener to DB for updates for players list.
     */
    useEffect(() => {
        if(!documentRef) return; 

        saveInSessionStorage(gameid, username, documentRef);

        const unsubscribe = onSnapshot(documentRef, snapshot => {
            if (!snapshot.data()) {
                console.error("Document does not exist!");
                return;
            }

            setPlayers(snapshot.data().players);
            setIsReady(snapshot.data().players.some(player => player.username === username && player.ready === true));
        });

        return () => unsubscribe();
    }, [documentRef]);

    useEffect(() => {
        const handleAllPlayersReady = async () => {
            const areAllPlayersReady = players => players.every(player => player.ready === true); 
            
            if(players.length !== 0 && areAllPlayersReady(players)) {
                // denne metoden blir sendt flere ganger enn nødvendig
                try {
                    await updateDoc(documentRef, { state: "IN_PROGRESS" });
                } catch (err) {
                    console.log("Error: " + err.message);
                }

                setView("GAME");
            }
        };

        handleAllPlayersReady();
    });

    /**
     * Checks if all players are ready and updates game state.
     */
    const handleReadyUp = async () => {
        if(isReady) return;
        try {    
            const updatePlayerStatus = async (transaction) => {
                const docSnapshot = await transaction.get(documentRef);
                if (!docSnapshot.exists) {
                    throw new Error("Document does not exist!");
                }

                const players = docSnapshot.data().players;
                const updatedPlayers = players.map(player => {
                    if (player.username === username) {
                        return {...player, ready: true}
                    }
                    return player;
                });

                transaction.update(documentRef, { players: updatedPlayers });
            };
                
            setIsReady(true);
            console.log(`Player: ${username} is ready`);
            await runTransaction(db, updatePlayerStatus);
        } catch(err) {
            console.log("Error: " + err.message);
        }
    };  

    return(
        <div
        className="relative min-h-screen bg-cover bg-center flex flex-col justify-start items-center overflow-hidden h-screen w-full bg-gray-500" 
        style={{ backgroundImage: `url('${require("../img/lake.png")}')` }}
    >

        {/* Header */}
        <div className="flex flex-col justify-center items-center w-full pt-20">
            <h1 className="text-3xl pr-7 font-serif">MEYER</h1>
            <h1 className="text-3xl pl-7 font-serif">ONLINE</h1>
        </div>

        {/* Players */}
        <div className="absolute top-40 w-[90%] flex flex-wrap justify-center items-center">
            {players.map(player => (<p className={`mx-2 px-2 my-2 ${player.ready ? "text-green-400" : "text-red-400"} bg-gray-200 bg-opacity-20 p-1 text-center rounded-md font-roboto text-xl`} key={player.username}>{player.username}</p>))}
        </div>

        {/* Box */}
        <div className={`mt-[580px] w-full h-screen bg-[#2A2E54] rounded-t-3xl flex flex-col justify-start items-center z-1`}>
            <div className={`bg-[#281F3C] shadow-xl shadow-gray-800 w-[350px] h-[170px] rounded-xl translate-y-[-100px] flex flex-col justify-center items-center`}>
                <div className="flex ml-24 w-full">
                    <p className={`mb-4 text-gray-300 text-2xl font-oswald`}>🎲 🎲 Game ID: &nbsp;</p>
                    <p className="text-[#F79437] text-2xl font-oswald">{gameid}</p>
                </div>
                <div className="flex w-full items-center justify-center">
                    <button
                        className={`m-2 w-[120px] h-[45px] bg-[#A999FE] rounded-xl text-xl text-[${styles.textcolor}] font-oswald`}
                        onClick={() => handleLeaveGame(username, documentRef, resetGameState)}
                    >
                        Leave
                    </button>
                    <button
                        className={`m-2 w-[120px] h-[45px] ${isReady ? "bg-green-500" : "bg-[#A999FE]"} rounded-xl text-xl text-[${styles.textcolor}] font-oswald`}
                        onClick={handleReadyUp}
                    >
                        Ready
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default GameLobby;