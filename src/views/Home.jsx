import React, { useState, useEffect } from "react";
import { BiGame } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import { collection, doc, addDoc, getDocs, query, where, runTransaction } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Initial screen allowing users to either host or join a game.
 */
const Home = ({ resetGameState , gameid, setGameid, username, setUsername, setView, setDocumentRef }) => {

    const [hostView, setHostView] = useState(true);

    const collectionRef = collection(db, "games");
    const q = query(collectionRef, where("gameid", "==", gameid));

    useEffect(() => {
        if(localStorage.getItem("isNotified") === "true") return;
        
        alert(`Set the webpage to homescreen for optimal use. Hit the share button, then scroll down to add to homescreen.`);
        localStorage.setItem("isNotified", "true");
    }, []);

    /**
     *  Creates a new game in the firestore database
     */
    const createGame = async () => {
        try {
            const newGameRef = await addDoc(collectionRef, {
                gameid: gameid,
                currentPlayer: {
                    username: username,
                    ready: true,
                    dice1: 0,
                    dice2: 0,
                    inputDice1: 0,
                    inputDice2: 0,
                },
                previousPlayer: {},
                players: [
                    {
                        username: username,
                        ready: false,
                        dice1: 0,
                        dice2: 0,
                        inputDice1: 0,
                        inputDice2: 0,
                    },
                ],
                roundnumber: 0,
                state: "CREATED",
            }); 
            console.log("Game created");

            // Sets the documentRef, saves us form extra querying later.
            setDocumentRef(newGameRef);
        } catch(err) {
            console.log("Error: " + err);
        }
    };

    /**
     * Sets the states from the App so that the next "page" 
     * renders
     */
    const handleHostedGame = async () => {
        try {
            const q = query(collectionRef, where("gameid", "==", gameid));
            const querySnapshot = await getDocs(q);

            if(gameid === "" || username === "") {
                alert("Fill out username/gameid");
            } else if(username.length > 14 || gameid.length > 14) {
                alert("Too long username or gameid (Max 14)");
            } else if(!querySnapshot.empty) {
                alert("Game id in use");
            } else {
                createGame();
                resetGameState();
                setView("HOST_LOBBY");
            }
        } catch (err) {
            console.log("Error: " + err.message);
        }
    };

    /**
     * Adds the player to the specified game in the database after 
     * performing necessary checks using a transaction.
     */
    const playerJoinGame = async () => {
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const documentRef = doc(collectionRef, querySnapshot.docs[0].id);
                setDocumentRef(documentRef);
                
                const joinTransaction = async (transaction) => {
                    const docSnapshot = await transaction.get(documentRef);
                    if (!docSnapshot.exists) {
                        throw new Error("Document does not exist!");
                    }

                    // Checks if the game has started
                    if(docSnapshot.data().state === "IN_PROGRESS") {
                        return "GAME_STARTED";
                    };
    
                    // Chekcs if the username exists
                    const players = docSnapshot.data().players;
                    for (let player of players) {
                        if (player.username.toUpperCase() === username.toUpperCase()) {
                            return "USERNAME_EXISTS";
                        }
                    }
                    players.push({
                        username: username,
                        ready: false,
                        dice1: 0,
                        dice2: 0,
                        inputDice1: 0,
                        inputDice2: 0,
                    });
                    transaction.update(documentRef, { players: players });
                };
                
                const transactionResult = await runTransaction(db, joinTransaction);
    
                if (transactionResult === "USERNAME_EXISTS") {
                    alert(`Username: ${username} is already in use!`);
                    return;
                }
                if(transactionResult === "GAME_STARTED") {
                    alert("Game has started");
                    return;
                }
                
                console.log("Player joined the game!");
                resetGameState();
                setView("JOIN_LOBBY");
    
            } else {
                alert(`Game id: ${gameid}, does not exist`);
            }
        } catch (err) {
            console.log("Error: " + err.message);
        }
    };

    /**
     * Verifies user input before attempting to join a game.
     */
    const handleJoinGame = async () => {
        if (username === "" || gameid === "") {
            alert("Fill out username/gameid");
        } else if(username.length > 14 || gameid.length > 14) {
            alert("Too long username or gameid (Max 14)");
        } else {
            playerJoinGame();
        }
    };

    if(hostView) {
        return(
            <div
                className="relative min-h-screen bg-cover bg-center flex flex-col justify-center items-center h-screen w-full bg-gray-500" 
                style={{ backgroundImage: `url('${require("../img/lake.png")}')` }}
            >

                {/* Header */}
                <div className="flex flex-col justify-center items-center mb-16 w-full">
                    <h1 className="text-3xl pr-7 font-serif">MEYER</h1>
                    <h1 className="text-3xl pl-7 font-serif">ONLINE</h1>
                </div>

                {/* Selection */}
                <div className="flex justify-between w-[265px] text-white">
                    <p
                        className="text-gray-300 text-xl mx-8 cursor-pointer font-oswald"
                        onClick={() => setHostView(true)}
                    >
                        Host
                    </p>
                    <p
                        onClick={() => setHostView(false)}
                        className="text-gray-300 text-xl mx-8 cursor-pointer font-oswald"
                    >
                        Join
                    </p>
                </div>
                
                {/* Box */}
                <div className={`mt-10 w-[350px] h-[280px] bg-white rounded-md flex flex-col justify-center items-center z-1`}>

                    {/* Half circle */}
                    <div className={`w-16 h-10 rounded-t-full relative right-20 top-[-20px] bg-white`} />

                    <div className="flex justify-start px-2  items-end w-[80%] h-[20%] border-b-[3px] border-[#2D0600]">
                        <p className="text-3xl text-[#01ADCB]"><BiGame/></p>
                        <input 
                            className={`mx-3 text-xl placeholder-gray-400 outline-none text-[#2D0600] bg-white font-serif`}
                            placeholder="Game ID"
                            onChange={e => setGameid(e.target.value)}
                        />
                    </div>
                    <div className="mt-6 flex justify-start px-2 items-end w-[80%] h-[20%] border-b-[3px] border-[#2D0600]">
                        <p className="text-3xl text-[#01ADCB]"><BsFillPersonFill/></p>
                        <input
                            className={`mx-3 text-xl placeholder-gray-400 outline-none text-[#2D0600] bg-white font-serif`}
                            placeholder="Username"
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <button
                        className="w-[60%] mt-6 h-[25%] bg-[#01ADCB] rounded-xl text-[#2D0600] text-xl mb-8 font-oswald"
                        onClick={handleHostedGame}
                    >
                        Host
                    </button>
                </div>

                {/* Other views */}
                <div className="text-gray-300 flex mt-6">
                    <p
                        className="px-6 cursor-pointer"
                        onClick={() => setView("TUTORIAL")}
                    >
                        Howto
                    </p>
                    <p
                        className="px-6 cursor-pointer"
                        onClick={() => setView("DEVELOPER")}
                    >
                        Developer
                    </p>
                </div>

            </div>
        );
    } else {
        return(
            <div
                className="relative min-h-screen bg-cover bg-center flex flex-col justify-center items-center h-screen w-full bg-gray-500"
                style={{ backgroundImage: `url('${require("../img/lake.png")}')`}}
            >

                {/* Header */}
                <div className="flex flex-col justify-center items-center mb-16 w-full">
                    <h1 className="text-3xl pr-7 font-serif">MEYER</h1>
                    <h1 className="text-3xl pl-7 font-serif">ONLINE</h1>
                </div>

                {/* Selection */}
                <div className="flex justify-between w-[265px] text-white">
                    <p
                        className="text-gray-300 text-xl mx-8 cursor-pointer font-oswald"
                        onClick={() => setHostView(true)}
                    >
                        Host
                    </p>
                    <p
                        onClick={() => setHostView(false)}
                        className="text-gray-300 text-xl mx-8 cursor-pointer font-oswald"
                    >
                        Join
                    </p>
                </div>
                
                {/* Box */}
                <div className={`mt-10 w-[350px] h-[280px] bg-white  rounded-md flex flex-col justify-center items-center z-1`}>

                    {/* Half circle */}
                    <div className={`w-16 h-10 rounded-t-full relative left-20 top-[-20px] bg-white`} />

                    <div className="flex justify-start px-2  items-end w-[80%] h-[20%] border-b-[3px] border-[#2D0600]">
                        <p className="text-3xl text-[#A999FE]"><BiGame/></p>
                        <input 
                            className={`mx-3 text-xl placeholder-gray-400 outline-none text-[#2D0600] bg-white font-serif`}
                            placeholder="Game ID"
                            onChange={e => setGameid(e.target.value)}
                        />
                    </div>
                    <div className="mt-6 flex justify-start px-2 items-end w-[80%] h-[20%] border-b-[3px] border-[#2D0600] font-serif">
                        <p className="text-3xl text-[#A999FE]"><BsFillPersonFill/></p>
                        <input
                            className={`mx-3 text-xl placeholder-gray-400 outline-none text-[#2D0600] bg-white`}
                            placeholder="Username"
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <button
                        className="w-[60%] mt-6 h-[25%] bg-[#A999FE] rounded-xl text-[#2D0600] text-xl mb-8 font-oswald"
                        onClick={handleJoinGame}
                    >
                        Join
                    </button>
                </div>

                {/* Other views */}
                <div className="text-gray-300 flex mt-6">
                    <p
                        className="px-6 cursor-pointer"
                        onClick={() => setView("TUTORIAL")}
                    >
                        Howto
                    </p>
                    <p
                        className="px-6 cursor-pointer"
                        onClick={() => setView("DEVELOPER")}
                    >
                        Developer
                    </p>
                </div>

            </div>
        );
    }
};

export default Home;