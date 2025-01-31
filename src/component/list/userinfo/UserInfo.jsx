import React from 'react'
import './userinfo.css'
import {useuserStore} from "../../libere/userstore"
function UserInfo() {
  const { currentUser } = useuserStore();

  return (
    <div className='userinfo'>
      <div className='user' >
      <img src={currentUser.avatar||'./avatar.png'} alt=''/>
<h2> {currentUser.username} </h2>
      </div>
      <div className='icons' >
        <img src='./more.png' alt=''/>
        <img src='./video.png' alt=''/>
        <img src='./edit.png' alt=''/>
      </div>
    </div>
  )
}

export default UserInfo
