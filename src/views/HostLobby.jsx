import React, { useEffect, useState } from "react";
import { updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import Header from "../components/Universal/Header";
import NavButton from "../components/Universal/NavButton";
import Players from "../components/Universal/Players";

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
                className="min-h-screen bg-cover bg-center flex flex-col justify-end pt-20 items-center h-screen w-full bg-gray-500 overflow-hidden" 
                style={{ backgroundImage: `url('${require("../img/lake.png")}')` }}
            >
                <Header top="" />
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
                            <NavButton text="Start Game" onClickFunction={() => handleStartGame()} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default HostLobby;