import React, { useState, useEffect, useRef } from 'react';
import { api, ApiMessage, ApiProfile } from '../../../lib/api';
import { Send, Search, MessageSquare, ArrowLeft } from 'lucide-react';
import { MemberProfile } from '../../../types';

interface MessagesViewProps {
  activeProfile: MemberProfile;
  peerProfile?: MemberProfile | null;
}

export function MessagesView({ activeProfile, peerProfile }: MessagesViewProps) {
  const [recentChats, setRecentChats] = useState<{ user: ApiProfile; lastMessage: ApiMessage }[]>([]);
  const [selectedUser, setSelectedUser] = useState<ApiProfile | null>(null);
  const [conversation, setConversation] = useState<ApiMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If peerProfile is provided, we should probably set them as selected user initially
  // but we need an ApiProfile for them. Let's do a quick translation.
  useEffect(() => {
    if (peerProfile && !selectedUser) {
      // Find the UUID if we can, else just use the peerProfile id as a placeholder
      // In a real app we'd fetch the user profile by usn or id.
      setSelectedUser({
        id: peerProfile.id, 
        user_id: peerProfile.id,
        full_name: peerProfile.name,
        bio: peerProfile.bio || null,
        avatar_url: peerProfile.avatar || null,
      });
    }
  }, [peerProfile]);

  useEffect(() => {
    loadRecentChats();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser.user_id);
    }
  }, [selectedUser]);

  useEffect(() => {
    // Scroll to bottom when messages load or change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const loadRecentChats = async () => {
    setIsLoadingChats(true);
    try {
      const messages = await api.messages.listRecent();
      
      // Group by user id to get distinct chats
      // Since recent chats return messages, we need to extract the other user's info.
      // This is a simplified approach; ideally the backend returns a Chat list with user profiles.
      // For now we'll fetch all user profiles to map them if needed, or just list the messages.
      // Let's assume listRecent returns messages where either sender or receiver is not us.
      
      const userMap = new Map<string, ApiMessage>();
      messages.forEach(msg => {
        const otherId = msg.sender_id === activeProfile.id ? msg.receiver_id : msg.sender_id;
        if (!userMap.has(otherId)) {
          userMap.set(otherId, msg);
        }
      });
      
      // Fetch user profiles for these IDs
      const usersList = await api.users.list(); 
      // Note: we might need a dedicated endpoint to fetch profiles by user ID, 
      // but for now we'll just mock it or use what we have if users.list returns profiles.
      // Since users.list returns ApiUser, let's use a dummy profile if not found.
      
      const chats = Array.from(userMap.entries()).map(([otherId, lastMsg]) => {
        const user = usersList.find(u => u.id === otherId);
        return {
          user: {
            id: otherId,
            user_id: otherId,
            full_name: user?.email || 'User ' + otherId.substring(0, 4),
            bio: null,
            avatar_url: null,
          },
          lastMessage: lastMsg
        };
      });
      
      setRecentChats(chats);
    } catch (err) {
      console.error('Failed to load recent chats:', err);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const loadConversation = async (otherUserId: string) => {
    setIsLoadingMessages(true);
    try {
      const msgs = await api.messages.listConversation(otherUserId);
      setConversation(msgs.reverse()); // Ensure chronological order if descending
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    
    try {
      const msg = await api.messages.create({
        receiver_id: selectedUser.user_id,
        content: newMessage.trim(),
      });
      
      setConversation(prev => [...prev, msg]);
      setNewMessage('');
      
      // Update recent chats
      loadRecentChats();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0C0D0E] border border-gray-200 dark:border-[#26282A] rounded-2xl overflow-hidden shadow-xl h-[calc(100vh-8rem)] min-h-[600px] flex">
      {/* Sidebar - Recent Chats */}
      <div className={`w-full md:w-80 border-r border-gray-200 dark:border-[#26282A] flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-[#26282A]">
          <h2 className="font-heading text-lg font-bold text-gray-900 dark:text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] rounded-xl pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#D4A373]/50 transition-colors"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoadingChats ? (
            <div className="p-4 text-center text-gray-500 text-sm">Loading chats...</div>
          ) : recentChats.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 h-full opacity-50">
              <MessageSquare className="w-8 h-8 text-gray-400" />
              <p className="text-sm font-subheading text-gray-500">No messages yet</p>
            </div>
          ) : (
            recentChats.map((chat) => (
              <button
                key={chat.user.user_id}
                onClick={() => setSelectedUser(chat.user)}
                className={`w-full text-left p-4 border-b border-gray-100 dark:border-[#1E2022] hover:bg-gray-50 dark:hover:bg-[#141517] transition-colors flex gap-3 ${selectedUser?.user_id === chat.user.user_id ? 'bg-orange-50 dark:bg-[#141517] border-l-4 border-l-[#D4A373]' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1E2022] flex items-center justify-center text-[#D4A373] font-bold shrink-0 overflow-hidden">
                  {chat.user.avatar_url ? (
                    <img src={chat.user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    chat.user.full_name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-heading text-sm font-bold text-gray-900 dark:text-white truncate">{chat.user.full_name}</h4>
                    <span className="text-[10px] text-gray-500">{new Date(chat.lastMessage.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-[#8E9296] truncate">{chat.lastMessage.content}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedUser ? 'hidden md:flex' : 'flex'}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#26282A] flex items-center gap-3 bg-white dark:bg-[#0C0D0E]">
              <button 
                onClick={() => setSelectedUser(null)}
                className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-[#1E2022] flex items-center justify-center text-[#D4A373] font-bold overflow-hidden">
                {selectedUser.avatar_url ? (
                  <img src={selectedUser.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  selectedUser.full_name?.charAt(0) || 'U'
                )}
              </div>
              <div>
                <h3 className="font-heading font-bold text-gray-900 dark:text-white">{selectedUser.full_name}</h3>
                <p className="text-xs text-gray-500 font-subheading">Member</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#08090A]">
              {isLoadingMessages ? (
                <div className="text-center text-gray-500 text-sm py-4">Loading messages...</div>
              ) : conversation.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2 opacity-50">
                  <MessageSquare className="w-10 h-10" />
                  <p>Start a conversation with {selectedUser.full_name}</p>
                </div>
              ) : (
                conversation.map((msg, i) => {
                  const isMe = msg.sender_id === activeProfile.id;
                  return (
                    <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-[#D4A373] text-white rounded-br-none shadow-sm' : 'bg-white dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] text-gray-900 dark:text-gray-100 rounded-bl-none shadow-sm'}`}>
                        <p className="text-sm">{msg.content}</p>
                        <span className={`text-[10px] mt-1 block ${isMe ? 'text-white/80 text-right' : 'text-gray-500'}`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white dark:bg-[#0C0D0E] border-t border-gray-200 dark:border-[#26282A]">
              <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] rounded-full pl-5 pr-12 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#D4A373]/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#D4A373] text-white flex items-center justify-center hover:bg-[#c49363] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50/50 dark:bg-[#08090A] p-8">
            <div className="w-16 h-16 rounded-full bg-white dark:bg-[#141517] border border-gray-200 dark:border-[#26282A] flex items-center justify-center shadow-sm">
              <MessageSquare className="w-8 h-8 text-[#D4A373]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-gray-900 dark:text-white text-lg">Your Messages</h3>
              <p className="text-sm font-subheading text-gray-500 mt-1">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
