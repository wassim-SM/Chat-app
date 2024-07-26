import React from 'react'
import './list.css'
import UserInfo from './userinfo/UserInfo'
import ChtaList from './chatuser/ChtaList'
function List() {
  return (
    <div className='list'>
      <UserInfo/>
      <ChtaList />
    </div>
  )
}

export default List
