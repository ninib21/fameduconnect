import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessages } from '../../contexts/MessageContext';
import ConversationList from '../../components/messaging/ConversationList';
import ChatWindow from '../../components/messaging/ChatWindow';
import NewMessageModal from '../../components/messaging/NewMessageModal';
import { PlusIcon } from '@heroicons/react/24/outline';

const MessagesPage = ({ user }) => {
  const { t } = useTranslation();
  const { conversations, activeConversation, dispatch } = useMessages();
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    // Mock conversations data
    const mockConversations = [
      {
        id: '1',
        participants: [user.id, 'teacher1'],
        participantNames: [user.name, 'Ms. Johnson'],
        lastMessage: {
          content: 'Thank you for the update on Emma\'s progress.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          senderId: user.id
        },
        messages: [
          {
            id: '1',
            senderId: 'teacher1',
            senderName: 'Ms. Johnson',
            content: 'Emma did excellent work on her math assignment today!',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true
          },
          {
            id: '2',
            senderId: user.id,
            senderName: user.name,
            content: 'Thank you for the update on Emma\'s progress.',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: true
          }
        ]
      }
    ];
    
    dispatch({ type: 'SET_CONVERSATIONS', payload: mockConversations });
  }, [dispatch, user]);

  return (
    <div className="h-full flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{t('navigation.messages')}</h2>
            <button
              onClick={() => setShowNewMessage(true)}
              className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <ConversationList 
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={(conv) => dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conv })}
          currentUserId={user.id}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {activeConversation ? (
          <ChatWindow 
            conversation={activeConversation}
            currentUser={user}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <NewMessageModal
          onClose={() => setShowNewMessage(false)}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default MessagesPage;