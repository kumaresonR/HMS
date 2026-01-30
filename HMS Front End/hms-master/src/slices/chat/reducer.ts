import { createSlice } from "@reduxjs/toolkit";
import { getDirectContact, getMessages, addMessage, deleteMessage } from "./thunk";

export const initialState: any = {
  chats: [],
  messages: [],
  error: {},
  loading: true,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDirectContact.fulfilled, (state: any, action: any) => {
      state.chats = action.payload;
      state.loading = false;
    });
    builder.addCase(getDirectContact.rejected, (state: any, action: any) => {
      state.error = action.error.message;
    });

    builder.addCase(getMessages.fulfilled, (state: any, action: any) => {
      state.messages = [action.payload];
      state.loading = false;
    });
    builder.addCase(getMessages.rejected, (state: any, action: any) => {
      state.error = action.error.message;
    });

    builder.addCase(addMessage.fulfilled, (state: any, action: any) => {
      const { roomId, ...newMessage } = action.payload;
      const chat = state.messages.find((msg: any) => msg.roomId === roomId);
      if (chat) {
        chat.usermessages.push(newMessage);
      }
    });
    builder.addCase(addMessage.rejected, (state: any, action: any) => {
      state.error = action.error.message;
    });

    builder.addCase(deleteMessage.fulfilled, (state: any, action: any) => {
      state.messages = state.messages.map((chat: any) => ({
        ...chat,
        usermessages: chat.usermessages.filter((msg: any) => msg.id !== action.payload),
      }));
    });
    builder.addCase(deleteMessage.rejected, (state: any, action: any) => {
      state.error = action.error.message;
    });
  },
});

export default chatSlice.reducer;
