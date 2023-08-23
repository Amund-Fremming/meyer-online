import { runTransaction } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * This function is responsible to remove a player from the game, and then render back to the start.
 * 
 * @param {a players usernam } username 
 * @param {Document referance to the game entry we are leaving} documentRef 
 * @param {A function that resetsThe game states} resetGameState 
 */
export const handleLeaveGame = async (username, documentRef, resetGameState) => {
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