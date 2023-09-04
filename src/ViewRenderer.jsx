import React, { useEffect, useState } from "react";
import Home from "./views/Home";
import HostLobby from "./views/HostLobby";
import JoinLobby from "./views/JoinLobby";
import GameLobby from "./views/GameLobby";
import Game from "./views/Game";
import { collection, doc, getDocs, where, query } from "firebase/firestore";
import { db } from "./config/firebase";
import Tutorial from "./views/Tutorial";
import Developer from "./views/Developer";

/**
 * Renders the correct view, and controlls the game flow.
 */
const ViewRenderer = () => {

    const initialView = sessionStorage.getItem("view") || "HOME";
    const initialUsername = sessionStorage.getItem("username") || "";
    const initialGameId = sessionStorage.getItem("gameid") || "";

    const [view, setView] = useState(initialView);
    const [username, setUsername] = useState(initialUsername);
    const [gameid, setGameId] = useState(initialGameId);
    const [documentRef, setDocumentRef] = useState();

    const resetGameState = () => {
        setView("HOME");
        sessionStorage.clear();
    };

    /**
     * Updates the documentRef when a player refreshes their page. 
     */
    useEffect(() => {
        const getDocumentRef = async () => {
            const collectionRef = collection(db, "games");
            const q = query(collectionRef, where("gameid", "==", gameid));
            try {
                const querySnapshot = await getDocs(q);
                if(!querySnapshot.empty) {
                    const documentRefLocal = doc(collectionRef, querySnapshot.docs[0].id);
                    setDocumentRef(documentRefLocal);
                }
            } catch(err) {
                console.log(err.message);
            }
        };

        getDocumentRef()
    }, []);

    const saveInSessionStorage = (gameidlocal, usernamelocal, documentReflocal) => {
        sessionStorage.setItem("gameid", gameidlocal);
        sessionStorage.setItem("username", usernamelocal);
        sessionStorage.setItem("documentRef", JSON.stringify(documentReflocal));
        sessionStorage.setItem("view", view);
    };

    switch(view) {
        case "HOME":
            return(
                <Home
                    resetGameState={resetGameState}
                    gameid={gameid}
                    setGameid={setGameId}
                    username={username}
                    setUsername={setUsername}
                    setView={setView}
                    setDocumentRef={setDocumentRef}
                /> 
            );
        case "JOIN_LOBBY":
            return(
                <JoinLobby
                    resetGameState={resetGameState}
                    gameid={gameid}
                    username={username}
                    setView={setView}
                    documentRef={documentRef}
                    saveInSessionStorage={saveInSessionStorage}
                />
            );
        case "HOST_LOBBY":
            return(
                <HostLobby
                    resetGameState={resetGameState}
                    gameid={gameid}
                    username={username}
                    setView={setView}
                    documentRef={documentRef}
                    saveInSessionStorage={saveInSessionStorage}
                />
            );
        case "GAME_LOBBY":
            return(
                <GameLobby
                    resetGameState={resetGameState}
                    gameid={gameid}
                    username={username}
                    setView={setView}
                    documentRef={documentRef}
                    saveInSessionStorage={saveInSessionStorage}
                />
            );
        case "GAME":
            return(
                <Game 
                    gameid={gameid}
                    username={username}
                    documentRef={documentRef}
                    saveInSessionStorage={saveInSessionStorage}
                    resetGameState={resetGameState}
                />
            );

        case "TUTORIAL":
            return(
                <Tutorial
                    resetGameState={resetGameState}
                />
            );

        case "DEVELOPER":
            return(
                <Developer
                    username={username}
                    documentRef={documentRef}
                    resetGameState={resetGameState}
                />
            );
        default:
            return(
                <h1>Something went wrong</h1>
            );
    };
};

export default ViewRenderer;