import React, { useEffect } from "react";
import { onSnapshot } from 'firebase/firestore';
import { handleLeaveGame } from "../util/databaseFunctions";
import Typewriter from "typewriter-effect";
import Header from "../components/Universal/Header";
import NavButton from "../components/Universal/NavButton";

/**
 * Component for players to join a game lobby. Listens for game state changes in the database and reacts accordingly.
 */
const JoinLobby = ({ gameid, username, setView, resetGameState, documentRef, saveInSessionStorage }) => {

    /**
     * Subscribes to database updates for the specified game, and changes view accordingly.
     */
    useEffect(() => {
        if(!documentRef) return;

        saveInSessionStorage(gameid, username, documentRef);

        const unsubscribe = onSnapshot(documentRef, snapshot => {
            if (!snapshot.data()) {
                console.log("Game deleted");
                alert("Game deleted");
                resetGameState();
                return;
            }
    
            if (snapshot.data().state === "WAITING") {
                setView("GAME_LOBBY");
            }
        });

        return () => unsubscribe();
    }, [documentRef, setView]);

    return(
        <div
            className="relative min-h-screen bg-cover bg-center flex flex-col justify-start pt-20 items-center h-screen w-full bg-gray-500" 
            style={{ backgroundImage: `url('${require("../img/lake.png")}')` }}
        >
            <Header />

            {/* Info section */}
            <div className="text-2xl font-oswald text-gray-400 w-full flex flex-col justify-end items-center absolute bottom-10">
                <div className="flex w-full justify-center">
                    <p>Waiting for host &nbsp;</p>
                    <Typewriter 
                        options = {{
                            strings: [". . ."],
                            autoStart: true,
                            loop: true,
                            cursor: "",
                            pauseFor: 0,
                        }}
                    />
                </div>

                <NavButton text="Leave" onClickFunction={() => handleLeaveGame(username, documentRef, resetGameState)} />
            </div>
        </div>
    );
};

export default JoinLobby;