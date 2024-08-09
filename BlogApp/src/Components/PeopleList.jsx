import React from 'react';
import './PeopleList.css';
import { Buffer } from 'buffer';

const PeopleList = ({ users, onSelectUser }) => {
  return (
    <div className="people-list">
      {users.map(user => (
        <div key={user.id} className="person-card" onClick={() => onSelectUser(user.username)}>
          <img 
            src={`data:${user.profilePicture.contentType};base64,${Buffer.from(user.profilePicture.data.data).toString('base64')}`} 
            alt={user.name} 
            className="person-image" 
          />
          <span>{user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default PeopleList;
