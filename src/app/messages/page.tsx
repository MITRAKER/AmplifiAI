'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface ConversationUser {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

function MessagesContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<ConversationUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if userId was passed via query params (from directory)
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      setSelectedUserId(userId);
    }
  }, [searchParams]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Load conversations
  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      try {
        setLoading(true);

        // Get all messages where user is sender or receiver
        const { data: allMessages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Get unique users in conversations
        const userIds = new Set<string>();
        allMessages?.forEach((msg: Message) => {
          if (msg.sender_id === user.id) {
            userIds.add(msg.receiver_id);
          } else {
            userIds.add(msg.sender_id);
          }
        });

        // Fetch user profiles for each conversation
        const conversationUsers: ConversationUser[] = [];
        for (const userId of userIds) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', userId)
            .single();

          const userMessages = allMessages?.filter(
            (msg: Message) =>
              (msg.sender_id === user.id && msg.receiver_id === userId) ||
              (msg.sender_id === userId && msg.receiver_id === user.id)
          );

          const lastMsg = userMessages?.[0];

          conversationUsers.push({
            id: userId,
            name: profile?.name || 'Unknown User',
            lastMessage: lastMsg?.content || 'No messages yet',
            lastMessageTime: lastMsg?.created_at
              ? new Date(lastMsg.created_at).toLocaleString()
              : '',
            unread:
              lastMsg?.receiver_id === user.id && !lastMsg.read ? true : false,
          });
        }

        // Sort by most recent message
        conversationUsers.sort((a, b) => {
          const timeA = new Date(a.lastMessageTime).getTime();
          const timeB = new Date(b.lastMessageTime).getTime();
          return timeB - timeA;
        });

        setConversations(conversationUsers);

        // If userId from query params, set it as selected
        const queryUserId = searchParams.get('userId');
        if (queryUserId && !selectedUserId) {
          setSelectedUserId(queryUserId);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [user, searchParams, selectedUserId]);

  // Subscribe to new messages for real-time updates
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .from('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},receiver_id.eq.${user.id})`,
        },
        (payload: any) => {
          // Refresh messages and conversations
          if (selectedUserId) {
            loadMessages(selectedUserId);
          }
          // Reload conversations to update last message
          setConversations((prev) => {
            // This will be updated by the conversation reload
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  }, [user, selectedUserId]);

  // Load messages for selected user
  const loadMessages = async (otherUserId: string) => {
    if (!user) return;

    try {
      const { data: msgs, error: msgsError } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (msgsError) throw msgsError;

      setMessages(msgs || []);

      // Mark messages as read
      if (msgs) {
        const unreadIds = msgs
          .filter((msg: Message) => msg.receiver_id === user.id && !msg.read)
          .map((msg: Message) => msg.id);

        if (unreadIds.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadIds);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedUserId) return;

    setSending(true);
    try {
      const { error: sendError } = await supabase.from('messages').insert([
        {
          sender_id: user.id,
          receiver_id: selectedUserId,
          content: newMessage.trim(),
        },
      ]);

      if (sendError) throw sendError;
      setNewMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedUserId
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations Sidebar */}
      <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        {conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedUserId(conversation.id)}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedUserId === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                } ${conversation.unread ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(conversation.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-gray-900 ${conversation.unread ? 'font-bold' : ''}`}>
                      {conversation.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="hidden lg:flex flex-1 flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {getInitials(selectedConversation.name)}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedConversation.name}
                </h2>
                <p className="text-xs text-gray-600">Active now</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm break-words">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender_id === user?.id
                          ? 'text-blue-100'
                          : 'text-gray-600'
                      }`}
                    >
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
