import React, { useEffect, useState } from "react";
import { updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { styles } from "../styles/styles";

/**
 * Displays the host's game lobby and manages game start or termination.
 */
const HostLobby = ({ gameid, username, setView, resetGameState, documentRef, saveInSessionStorage }) => {

    const [players, setPlayers] = useState([]);

    /**
     * Subscribes to player changes in the hosted game.
     */
    useEffect(() => {
        saveInSessionStorage(gameid, username, documentRef);

        if(!documentRef) return;

        const unsubscribe = onSnapshot(documentRef, snapshot => {
            if(!snapshot.data()) {
                console.log("Document does not exist!");
                return;
            }

            setPlayers(snapshot.data().players);
        });

        return () => unsubscribe();
    }, [documentRef]);

    /**
     * Deletes the game and resets to the landing page.
     */
    const handleLeaveGame = async () => {
        resetGameState();
        await deleteDoc(documentRef);
    };

    /**
     * Initiates the game by updating its state.
     */
    const handleStartGame = async () => {
        try {   
            await updateDoc(documentRef, { state: "WAITING" });
            setView("GAME_LOBBY");
            console.log("Game state changed. State: Waiting");
        } catch(err) {
            console.log("Error: " + err.message);
        }
    };

    if(true) {
        return(
            <div
                className="relative min-h-screen bg-cover bg-center flex flex-col justify-start pt-20 items-center h-screen w-full bg-gray-500 overflow-hidden" 
                style={{ backgroundImage: `url('${require("../img/lake.png")}')` }}
            >

                {/* Players */}
                <div className="absolute top-52 w-[70%] flex flex-wrap justify-center items-center">
                    {players.map(player => (<p className="mx-2 px-2 my-2 bg-gray-200 bg-opacity-20 p-1 text-center rounded-md text-gray-300 font-roboto text-xl" key={player.username}>{player.username}</p>))}
                </div>

                {/* Header */}
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-3xl pr-7 font-serif">MEYER</h1>
                    <h1 className="text-3xl pl-7 font-serif">ONLINE</h1>
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
                                className={`m-2 w-[120px] h-[45px] bg-[#A999FE] rounded-xl text-xl text-[${styles.textcolor}] font-oswald`}
                                onClick={handleStartGame}
                            >
                                Start Game
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default HostLobby;