import Avatar from '@material-ui/core/Avatar';
import React, { useState } from 'react';
import Session from '../../Session.js';
import TextField from '@material-ui/core/TextField';
import UserApi from '../../UserApi.js';
import firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';

export default function ChatRoom(props) {
  const session = new Session(props);
  const data = session.useSessionData();
  const [input, setInput] = useState("");

  const chats = Object.keys(data).map((id) => ({
    id: id,
    message: data[id].message,
    timestamp: data[id].timestamp,
    user: data[id].user,
  }));
  chats.sort((a, b) => b.timestamp - a.timestamp);

  const handleKeyEvent = key => {
    if (key === "Enter" && input.length > 0) {
      const chatData = {
        message: input,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: session.getMyUserId(),
      }
      session.getSessionDatabaseRef().push(chatData, (error) => {
        if (error) {
          console.error("Error storing session metadata", error);
        }
      });
      setInput("");
    }
  }

  const chatListItems = chats.slice(0, 10).map((chat, i) => (
    <ListItem
        key={chat.id}
        style={{opacity: (10 - i) / 10}}
        disabled={true}
        primaryText={UserApi.getName(chat.user)}
        secondaryText={chat.message}
        leftAvatar={<Avatar src={UserApi.getPhotoUrl(chat.user)} />} />
  ));
  return (
    <div style={{margin: 56}}>
      <TextField
          name="Chat message input"
          label="Type your message and press enter"
          fullWidth={true}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={(event) => handleKeyEvent(event.key)}
          value={input} />
      <List>
        {chatListItems}
      </List>
    </div>
  );
}
