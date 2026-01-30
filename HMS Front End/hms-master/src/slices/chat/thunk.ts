import { createAsyncThunk } from "@reduxjs/toolkit";

// Dummy data
const dummyChats = [
  { id: 1, name: "Alice", avatar: "avatar1.png" },
  { id: 2, name: "Bob", avatar: "avatar2.png" },
];

const dummyMessages = [
  {
    roomId: 1,
    usermessages: [
      { id: 1, sender: "Alice", text: "Hello!", timestamp: "10:00 AM" },
      { id: 2, sender: "You", text: "Hi Alice!", timestamp: "10:02 AM" },
    ],
  },
  {
    roomId: 2,
    usermessages: [
      { id: 1, sender: "Bob", text: "Good Morning!", timestamp: "9:00 AM" },
      { id: 2, sender: "You", text: "Good Morning, Bob!", timestamp: "9:05 AM" },
    ],
  },
];

// Thunks
export const getDirectContact = createAsyncThunk("chat/getDirectContact", async () => {
  return dummyChats; // Returning dummy chats directly
});

export const getMessages = createAsyncThunk("chat/getMessages", async (roomId: any) => {
  // Find messages for the given roomId
  const messages = dummyMessages.find((chat) => chat.roomId === roomId);
  return messages || { roomId, usermessages: [] };
});

export const addMessage = createAsyncThunk("chat/addMessage", async (newMessage: any) => {
  const { roomId, ...messageData } = newMessage;
  const room = dummyMessages.find((chat) => chat.roomId === roomId);
  if (room) {
    room.usermessages.push({ ...messageData, id: Date.now() }); // Add new message with unique ID
  }
  return messageData;
});

export const deleteMessage = createAsyncThunk("chat/deleteMessage", async (messageId: any) => {
  dummyMessages.forEach((chat) => {
    chat.usermessages = chat.usermessages.filter((msg) => msg.id !== messageId);
  });
  return messageId; // Return deleted message ID
});
