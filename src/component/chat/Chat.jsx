import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../libere/firebase";
import { useChatStore } from "../libere/chatstore";
import { useuserStore } from "../libere/userstore";
import Upload from "../libere/Upload";

function Chat() {
  const [showEmoji, setShowEmoji] = useState(false);
  const [changeText, setText] = useState("");
  const [chat, setChat] = useState(null);
  const [img, setImg] = useState({
    file: null,
    url: ""
  });

  const endRef = useRef(null);
  const { chatId, user } = useChatStore();
  const { currentUser } = useuserStore();

  const handleEmoji = (e, emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
    setShowEmoji(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleSend = async () => {
    if (changeText === "" && !img.file) return;

    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await Upload(img.file);
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const messageData = {
        senderId: currentUser.id,
        text: changeText,
        createdAt: new Date(),
        ...(imgUrl && { img: imgUrl })
      };

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion(messageData)
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);

          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = changeText;
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatsData.chats[chatIndex].updatedAt = Date.now();
            await updateDoc(userChatRef, {
              chats: userChatsData.chats
            });
          }
        }
      });

      setText(""); // Clear the input after sending
      setImg({ file: null, url: "" }); // Clear the image after sending
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (docSnapshot) => {
        setChat(docSnapshot.data());
      });

      return () => {
        unSub();
      };
    }
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <h2>{user.username}</h2>
            <p>seen at 1:30pm</p>
          </div>
        </div>
        <div className="icon">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message, index) => (
          <div className={`message ${message.senderId === currentUser.id ? "own" : ""}`} key={index}>
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p> {message.text} </p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="bottom">
        <div className="emoji-picker-container">
          <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>
          {showEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}
        </div>
        <input
          type="text"
          value={changeText}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
        />
        <div className="icon-container">
          <label htmlFor="file">
            <button className="icon-button">
              <img src="./img.png" alt="Attach" />
            </button>
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
          <button className="icon-button">
            <img src="./camera.png" alt="Camera" />
          </button>
          <button className="icon-button">
            <img src="./mic.png" alt="Mic" />
          </button>
        </div>
        <button className="sendButton" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
