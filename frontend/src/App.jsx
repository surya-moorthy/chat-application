import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Wifi, WifiOff } from 'lucide-react';

const App = () => {
  const [ws, setWs] = useState(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [inviteUser, setInviteUser] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatState, setChatState] = useState('login'); // 'login', 'lobby', 'chat'
  const [currentRoom, setCurrentRoom] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const connectWebSocket = () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    const newUserId = generateUserId();
    setUserId(newUserId);
    
    const socket = new WebSocket('ws://localhost:8000'); // Adjust URL as needed
    
    socket.onopen = () => {
      setConnected(true);
      setChatState('lobby');
      setError('');
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleServerMessage(data);
      } catch (err) {
        console.error('Error parsing message:', err);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      setChatState('login');
      setMessages([]);
      setCurrentRoom('');
      console.log('Disconnected from WebSocket server');
    };

    socket.onerror = (error) => {
      setError('Connection failed. Please check if the server is running.');
      console.error('WebSocket error:', error);
    };

    setWs(socket);
  };

  const handleServerMessage = (data) => {
    switch (data.type) {
      case 'JoinChat':
        setCurrentRoom(data.roomId);
        setRoomId(data.roomId);
        setChatState('chat');
        setMessages([{
          type: 'system',
          content: `Chat room created! Room ID: ${data.roomId}. Invited: ${data.invited}`,
          timestamp: new Date().toLocaleTimeString()
        }]);
        break;
      
      case 'joined':
        setCurrentRoom(data.roomId);
        setChatState('chat');
        setMessages([{
          type: 'system',
          content: `Successfully joined room: ${data.roomId}`,
          timestamp: new Date().toLocaleTimeString()
        }]);
        break;
      
      case 'message':
        setMessages(prev => [...prev, {
          type: 'received',
          content: data.message,
          timestamp: new Date().toLocaleTimeString()
        }]);
        break;
      
      case 'acknowledge':
        console.log('Message acknowledged:', data.message);
        break;
      
      case 'error':
        setError(data.message);
        break;
      
      default:
        console.log('Unknown message type:', data);
    }
  };

  const createChat = () => {
    if (!inviteUser.trim()) {
      setError('Please enter a username to invite');
      return;
    }
    
    if (ws && connected) {
      ws.send(JSON.stringify({
        type: 'createChat',
        user2: inviteUser
      }));
      setInviteUser('');
      setError('');
    }
  };

  const joinChat = () => {
    if (!joinRoomId.trim()) {
      setError('Please enter a room ID');
      return;
    }
    
    if (ws && connected) {
      ws.send(JSON.stringify({
        type: 'joinChat',
        roomId: joinRoomId
      }));
      setJoinRoomId('');
      setError('');
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    if (ws && connected && chatState === 'chat') {
      ws.send(JSON.stringify({
        type: 'sendData',
        message: newMessage
      }));
      
      setMessages(prev => [...prev, {
        type: 'sent',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      setNewMessage('');
    }
  };

  const disconnect = () => {
    if (ws) {
      ws.close();
    }
    setWs(null);
    setConnected(false);
    setChatState('login');
    setMessages([]);
    setCurrentRoom('');
    setRoomId('');
    setError('');
  };

  const goBackToLobby = () => {
    setChatState('lobby');
    setMessages([]);
    setCurrentRoom('');
    setRoomId('');
  };

  if (chatState === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <MessageCircle className="mx-auto h-12 w-12 text-blue-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">WebSocket Chat</h1>
            <p className="text-gray-600 mt-2">Enter your username to start chatting</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && connectWebSocket()}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={connectWebSocket}
              disabled={!username.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Wifi className="h-4 w-4" />
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (chatState === 'lobby') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Users className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">Chat Lobby</h1>
            <p className="text-gray-600 mt-2">Welcome, {username}!</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600">
              <Wifi className="h-4 w-4" />
              Connected
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Create New Chat</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={inviteUser}
                  onChange={(e) => setInviteUser(e.target.value)}
                  placeholder="Username to invite"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={createChat}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Create Chat Room
                </button>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Join Existing Chat</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="Room ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={joinChat}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Join Chat Room
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={disconnect}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <WifiOff className="h-4 w-4" />
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Chat Room</h1>
            <p className="text-sm text-gray-600">Room ID: {currentRoom}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Wifi className="h-4 w-4" />
              Connected as {username}
            </div>
            <button
              onClick={goBackToLobby}
              className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-3 py-1 rounded transition-colors"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === 'sent' ? 'justify-end' : 
              message.type === 'system' ? 'justify-center' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'sent'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'system'
                  ? 'bg-gray-200 text-gray-700 text-sm'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.type === 'sent' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;