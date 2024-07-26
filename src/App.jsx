import  { useEffect } from 'react';
import List from "./component/list/List";
import Details from "./component/details/Details";
import Login from "./component/login/Login";
import Chat from "./component/chat/Chat";
import Notification from "./component/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./component/libere/firebase";
import { useuserStore } from "./component/libere/userstore";
import { useChatStore } from "./component/libere/chatstore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useuserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        fetchUserInfo(user?.uid);
      } else {
        console.log("No user is signed in.");
        fetchUserInfo(null);
      }
    });
    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Details />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
