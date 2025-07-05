import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMessages } from '../../contexts/MessageContext';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NewMessageModal = ({ onClose, currentUser }) => {
  const { t } = useTranslation();
  const { dispatch } = useMessages();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Mock users data based on current user role
    const mockUsers = currentUser.role === 'parent' 
      ? [
          { id: 'teacher1', name: 'Ms. Johnson', role: 'teacher', subject: 'Mathematics' },
          { id: 'teacher2', name: 'Mr. Smith', role: 'teacher', subject: 'Science' },
          { id: 'teacher3', name: 'Mrs. Davis', role: 'teacher', subject: 'English' },
          { id: 'admin1', name: 'Principal Wilson', role: 'admin', department: 'Administration' }
        ]
      : currentUser.role === 'teacher'
      ? [
          { id: 'parent1', name: 'John Anderson', role: 'parent', children: ['Emma Anderson'] },
          { id: 'parent2', name: 'Sarah Miller', role: 'parent', children: ['Alex Miller'] },
          { id: 'parent3', name: 'Mike Johnson', role: 'parent', children: ['Sophie Johnson'] },
          { id: 'admin1', name: 'Principal Wilson', role: 'admin', department: 'Administration' }
        ]
      : [
          { id: 'teacher1', name: 'Ms. Johnson', role: 'teacher', subject: 'Mathematics' },
          { id: 'teacher2', name: 'Mr. Smith', role: 'teacher', subject: 'Science' },
          { id: 'parent1', name: 'John Anderson', role: 'parent', children: ['Emma Anderson'] },
          { id: 'parent2', name: 'Sarah Miller', role: 'parent', children: ['Alex Miller'] }
        ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, [currentUser.role]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.subject && user.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.children && user.children.some(child => 
        child.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) return;

    // Create new conversation
    const newConversation = {
      id: Date.now().toString(),
      participants: [currentUser.id, selectedUser.id],
      participantNames: [currentUser.name, selectedUser.name],
      lastMessage: {
        id: Date.now().toString(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: message.trim(),
        timestamp: new Date().toISOString(),
        read: false
      },
      messages: [{
        id: Date.now().toString(),
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: message.trim(),
        timestamp: new Date().toISOString(),
        read: false
      }]
    };

    dispatch({ type: 'SET_CONVERSATIONS', payload: [newConversation] });
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: newConversation });
    onClose();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'parent': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleInfo = (user) => {
    if (user.role === 'teacher') return user.subject;
    if (user.role === 'parent') return user.children?.join(', ');
    if (user.role === 'admin') return user.department;
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                New Message
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4">
              {/* User Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient
                </label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              {/* User List */}
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p className="text-sm">No users found</p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                        selectedUser?.id === user.id ? 'bg-primary-50 border-primary-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.name}
                            </p>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                              {t(`auth.${user.role}`)}
                            </span>
                          </div>
                          {getRoleInfo(user) && (
                            <p className="text-xs text-gray-500 truncate">
                              {getRoleInfo(user)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedUser || !message.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;