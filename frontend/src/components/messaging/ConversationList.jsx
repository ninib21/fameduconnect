import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { CheckIcon } from '@heroicons/react/24/outline';

const ConversationList = ({ conversations, activeConversation, onSelectConversation, currentUserId }) => {
  const { t } = useTranslation();

  const getOtherParticipantName = (conversation) => {
    return conversation.participantNames.find((name, index) => 
      conversation.participants[index] !== currentUserId
    ) || 'Unknown User';
  };

  const isMessageRead = (message) => {
    return message.senderId === currentUserId || message.read;
  };

  const getMessageStatusIcon = (message) => {
  if (message.senderId !== currentUserId) return null;
  
  return message.read ? (
    <div className="flex">
      <CheckIcon className="h-4 w-4 text-blue-500" />
      <CheckIcon className="h-4 w-4 text-blue-500 -ml-1" />
    </div>
  ) : (
    <CheckIcon className="h-4 w-4 text-gray-400" />
  );
};

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1">Start a new conversation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const isActive = activeConversation?.id === conversation.id;
        const otherParticipant = getOtherParticipantName(conversation);
        const lastMessage = conversation.lastMessage;
        const isUnread = lastMessage && !isMessageRead(lastMessage) && lastMessage.senderId !== currentUserId;

        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              isActive ? 'bg-primary-50 border-primary-200' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {otherParticipant.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-medium truncate ${
                    isUnread ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {otherParticipant}
                  </h3>
                  {lastMessage && (
                    <div className="flex items-center space-x-1">
                      {getMessageStatusIcon(lastMessage)}
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>

                {lastMessage && (
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-sm truncate ${
                      isUnread ? 'font-medium text-gray-900' : 'text-gray-600'
                    }`}>
                      {lastMessage.senderId === currentUserId ? 'You: ' : ''}
                      {lastMessage.content}
                    </p>
                    {isUnread && (
                      <div className="flex-shrink-0 ml-2">
                        <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                )}

                {!lastMessage && (
                  <p className="text-sm text-gray-500 mt-1">No messages yet</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;