import { createContext, useContext, useReducer, useEffect } from 'react';

const MessageContext = createContext();

const messageReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === action.payload.conversationId
            ? { ...conv, messages: [...conv.messages, action.payload], lastMessage: action.payload }
            : conv
        )
      };
    case 'SET_ACTIVE_CONVERSATION':
      return { ...state, activeConversation: action.payload };
    default:
      return state;
  }
};

export const MessageProvider = ({ children, user }) => {
  const [state, dispatch] = useReducer(messageReducer, {
    conversations: [],
    activeConversation: null,
    socket: null
  });

  const sendMessage = (conversationId, content) => {
    const message = {
      id: Date.now().toString(),
      conversationId,
      senderId: user.id,
      senderName: user.name,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  return (
    <MessageContext.Provider value={{ ...state, dispatch, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => useContext(MessageContext);