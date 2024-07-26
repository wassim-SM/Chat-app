import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"; // Correct imports
import { db } from "../../../libere/firebase";
import { useState } from "react";
import { useuserStore } from "../../../libere/userstore";
import './adduser.css'

function Adduser() {
  const { currentUser } = useuserStore();
  const [user, setUser] = useState(null); // State to store the fetched user

  const handleAdd = async () => {
    if (!user) {
      console.log("No user selected.");
      return;
    }

    const chatsCollectionRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      // Create a new chat document with a unique ID
      const newChatRef = doc(chatsCollectionRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
        participants: [currentUser.id, user.id],
      });

      const newChatData = {
        chatId: newChatRef.id,
        lastMessage: "",
        receiverId: currentUser.id,
        createdAt: Date.now(), // Use regular timestamp
      };

      // Ensure the userChats document for the selected user exists
      const userChatDocRef = doc(userChatsRef, user.id);
      const userChatDocSnap = await getDoc(userChatDocRef);
      if (!userChatDocSnap.exists()) {
        await setDoc(userChatDocRef, { chats: [] });
      }

      // Update userChats for the selected user
      await updateDoc(userChatDocRef, {
        chats: arrayUnion(newChatData),
      });

      // Ensure the userChats document for the current user exists
      const currentUserChatDocRef = doc(userChatsRef, currentUser.id);
      const currentUserChatDocSnap = await getDoc(currentUserChatDocRef);
      if (!currentUserChatDocSnap.exists()) {
        await setDoc(currentUserChatDocRef, { chats: [] });
      }

      // Update userChats for the current user
      newChatData.receiverId = user.id; // Update the receiverId for the current user
      await updateDoc(currentUserChatDocRef, {
        chats: arrayUnion(newChatData),
      });

      console.log("User added successfully");
    } catch (err) {
      console.log("Error adding user:", err);
    }
  };

  // Function to handle the search
  const handleShow = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    console.log("Searching for user:", username);

    try {
      // Reference to the "users" collection
      const usersRef = collection(db, "users");

      // Create a query to find the user by username
      const q = query(usersRef, where("username", "==", username));

      // Execute the query and get the matching documents
      const querySnapshot = await getDocs(q);

      // Check if any documents were found
      if (!querySnapshot.empty) {
        // Get the first matching document (if any)
        const userDoc = querySnapshot.docs[0].data();
        userDoc.id = querySnapshot.docs[0].id; // Set the user ID
        setUser(userDoc); // Update the state with the found user

        console.log("User found:", userDoc);
      } else {
        setUser(null); // No user found, clear the state
        console.log("User not found");
      }
    } catch (err) {
      console.log("Error fetching user:", err); // Log any errors
    }
  };

  return (
    <div className="adduser">
      <form onSubmit={handleShow}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="useradd">
          <div className="detailsUSER">
            <img src={user.avatar || "avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd} className="adduserbtn">Add User</button>
        </div>
      )}
    </div>
  );
}

export default Adduser;