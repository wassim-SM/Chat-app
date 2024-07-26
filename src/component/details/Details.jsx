import React from "react";
import "./details.css";
import { auth } from "../libere/firebase";
import { useChatStore } from "../libere/chatstore";
import { useuserStore } from "../libere/userstore";
function Details() {
  const {chatId,user,isCurrentUserBlocked,isReceiverBlocked,changeBlock}=
  useChatStore()
  const {currentUser}=useuserStore()
  return (
    <div className="detail">
      <div className="user">
        <img src= {user?.avatar||"./avatar.png"} alt="" />
        <h2> {user?.username} </h2>
        <p>User</p>
      </div>
   <div className="info">
    <div className="option">
      <div className="title">
        <span>Chat Settings</span>
        <img src="./arrowUp.png" alt="" />
      </div>
    </div>
    <div className="option">
      <div className="title">
        <span>Privacy & help</span>
        <img src="./arrowUp.png" alt="" />
      </div>
    </div>
    <div className="option">
      <div className="title">
        <span>Shared photos</span>
        <img src="./arrowDown.png" alt="" />
      </div>
      <div className="photos">
        <div className="photoItem">
          <div className="photoDetail">
          <span>photoball</span>

          </div>
          <img src="./download.png" alt="" className="icon" />

        </div>

        <div className="photoItem">
          <div className="photoDetail">
          <span>photoball</span>

          </div>
          <img src="./download.png" alt="" className="icon" />

        </div>
        
       

       
      </div>
    </div>
    <div className="option">
      <div className="title">
        <span>Shared files</span>
        <img src="./arrowUP.png" alt="" />
      </div>
    </div>
   
    <button className="detailbtn">Block User </button>
    <button className="logoutbtn"  onClick={()=>auth.signOut()}>Log Out</button>
   
    
   </div>
      
      
    </div>
  ); 
}

export default Details;