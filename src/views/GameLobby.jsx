import React, { useEffect, useState } from "react";
import { onSnapshot, runTransaction, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { handleLeaveGame } from "../util/databaseFunctions";
import NavButton from "../components/Universal/NavButton";
import Players from "../components/Universal/Players";
import Header from "../components/Universal/Header";
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

    /**
     * Checks if all players are ready and updates game state.
     */
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
     * Updates the players ready state in db when ready.
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
            className="min-h-screen bg-cover bg-center flex flex-col justify-end items-center h-screen w-full bg-gray-500" style={{ backgroundImage: `url('${require("../img/lake.png")}')`}}
        >
        <Header mt="20" />
        <Players players={players} />

        {/* Box */}
        <div className={`w-full h-30 bg-[#2A2E54] rounded-t-3xl flex flex-col justify-start items-center z-1`}>
            <div className={`bg-[#281F3C] shadow-xl shadow-gray-800 w-[350px] h-[170px] rounded-xl translate-y-[-100px] flex flex-col justify-center items-center`}>
                <div className="flex ml-24 w-full">
                    <p className={`mb-4 text-gray-300 text-2xl font-oswald`}>🎲 🎲 Game ID: &nbsp;</p>
                    <p className="text-[#F79437] text-2xl font-oswald">{gameid}</p>
                </div>
                <div className="flex w-full items-center justify-center">
                    <NavButton text="Leave" onClickFunction={() => handleLeaveGame(username, documentRef, resetGameState)} />

                    <button
                        className={`m-2 w-[120px] h-[45px] ${isReady ? "bg-green-400" : "bg-[#A999FE]"} rounded-xl text-xl text-[${styles.textcolor}] font-oswald`}
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