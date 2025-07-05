import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessages } from '../../contexts/MessageContext';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ChatWindow = ({ conversation, currentUser }) => {
  const { t } = useTranslation();
  const { sendMessage } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(conversation.id, newMessage.trim());
    setNewMessage('');
    inputRef.current?.focus();
  };

  const getOtherParticipant = () => {
    const otherParticipantIndex = conversation.participants.findIndex(id => id !== currentUser.id);
    return conversation.participantNames[otherParticipantIndex] || 'Unknown User';
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((message) => {
      const messageDate = format(new Date(message.timestamp), 'yyyy-MM-dd');
      
      if (!currentGroup || currentGroup.date !== messageDate) {
        currentGroup = {
          date: messageDate,
          messages: [message]
        };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(message);
      }
    });

    return groups;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM dd, yyyy');
  };

  const messageGroups = groupMessagesByDate(conversation.messages || []);
  const otherParticipant = getOtherParticipant();

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {otherParticipant.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{otherParticipant}</h2>
              <p className="text-sm text-gray-500">
                {isTyping ? 'Typing...' : 'Online'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <PhoneIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <VideoCameraIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <InformationCircleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messageGroups.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">Start a conversation</p>
              <p className="text-sm mt-1">Send a message to begin chatting with {otherParticipant}</p>
            </div>
          </div>
        ) : (
          messageGroups.map((group) => (
            <div key={group.date}>
              {/* Date Header */}
              <div className="flex justify-center mb-4">
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  {formatDateHeader(group.date)}
                </span>
              </div>

              {/* Messages */}
              {group.messages.map((message) => {
                const isOwnMessage = message.senderId === currentUser.id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {!isOwnMessage && (
                        <div className="flex items-center mb-1">
                          <span className="text-xs text-gray-500 font-medium">
                            {message.senderName}
                          </span>
                        </div>
                      )}
                      
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-primary-600 text-white rounded-br-md'
                            : 'bg-gray-100 text-gray-900 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder={`Message ${otherParticipant}...`}
                rows={1}
                className="block w-full resize-none border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:ring-primary-500 focus:border-primary-500 text-sm"
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaceSmileIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="flex-shrink-0 bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;