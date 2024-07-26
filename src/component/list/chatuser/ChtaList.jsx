import  { useEffect, useState } from 'react';
import './chatlist.css';
import Adduser from './adduser/Adduser';
import { useuserStore } from '../../libere/userstore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'; // Correctly import from firestore
import { db } from '../../libere/firebase';
import { useChatStore } from '../../libere/chatstore';

function ChatList() {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const { currentUser } = useuserStore();
  const { changeChat } = useChatStore();
  

  useEffect(() => {
    if (currentUser && currentUser.id) {
      const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
        if (res.exists()) {
          const items = res.data().chats;

          const promises = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const user = userDocSnap.data();
              return { ...item, user };
            }
            return null;
          });

          const chatData = (await Promise.all(promises)).filter(chat => chat !== null);
          setChats(chatData.sort((a, b) => b.createdAt - a.createdAt));
        }
      });

      return () => {
        unSub();
      };
    }
  }, [currentUser]);

  const handleSelect = async (chat) => {
    const updatedChats = chats.map(item => 
      item.chatId === chat.chatId ? { ...item, isSeen: true } : item
    );
 
    setChats(updatedChats);

    const userChats = updatedChats.map(({ user, ...rest }) => rest);

    const userChatsRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='chatlist'>
      <div className='search'>
        <div className='searchBar'>
          <img src='./search.png' alt='' />
          <input type="text" placeholder='Search' />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          className='add'
          alt=""
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {chats.map((chat) => (
        <div 
          className='item' 
          key={chat.chatId} 
          onClick={() => handleSelect(chat)} 
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe"
          }}
        >
          <img src={chat.user.avatar || "./avatar.png"} alt="" />
          <div className='text'>
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <Adduser />}
    </div>
  );
}

export default ChatList;
