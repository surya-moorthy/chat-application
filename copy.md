```
  import React, { useState, useEffect, useRef, useCallback } from 'react';

// Step 1: WebSocket Hook with Room Support
const useWebSocketRoom = (serverUrl, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomUsers, setRoomUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const { onMessage, onUserJoin, onUserLeave, onRoomUpdate } = options;

  // Step 2: Connection Management
  const connect = useCallback(() => {
    try {
      setConnectionStatus('Connecting');
      
      // Simulate WebSocket connection (replace with real WebSocket in production)
      const simulateConnection = () => {
        setConnectionStatus('Connected');
        
        // // Simulate server responses
        // const messageInterval = setInterval(() => {
        //   if (Math.random() > 0.7) { // Random messages
        //     const mockMessage = {
        //       type: 'message',
        //       id: Date.now(),
        //       user: 'User' + Math.floor(Math.random() * 100),
        //       message: 'Hello from the room!',
        //       room: currentRoom,
        //       timestamp: new Date().toISOString()
        //     };
        //     handleIncomingMessage(mockMessage);
        //   }
        // }, 8000);

        return {
          send: (data) => {
            console.log('Sending to server:', data);
            const parsedData = JSON.parse(data);
            
            // Simulate server responses
            setTimeout(() => {
              if (parsedData.type === 'join_room') {
                handleRoomJoin(parsedData.room, parsedData.user);
              } else if (parsedData.type === 'message') {
                // Echo message back
                handleIncomingMessage({
                  ...parsedData,
                  id: Date.now(),
                  timestamp: new Date().toISOString()
                });
              }
            }, 100);
          },
          close: () => {
            // clearInterval(messageInterval);
            setConnectionStatus('Disconnected');
            setCurrentRoom(null);
            setRoomUsers([]);
          },
          readyState: 1
        };
      };

      const ws = simulateConnection();
      socketRef.current = ws;
      setSocket(ws);
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionStatus('Error');
    }
  }, [currentRoom]);

  // Step 3: Message Handling
  const handleIncomingMessage = (data) => {
    switch (data.type) {
      case 'message':
        setMessages(prev => [...prev, data]);
        if (onMessage) onMessage(data);
        break;
      case 'user_joined':
        setRoomUsers(prev => [...prev, data.user]);
        if (onUserJoin) onUserJoin(data.user);
        break;
      case 'user_left':
        setRoomUsers(prev => prev.filter(user => user !== data.user));
        if (onUserLeave) onUserLeave(data.user);
        break;
      case 'room_users':
        setRoomUsers(data.users);
        if (onRoomUpdate) onRoomUpdate(data.users);
        break;
    }
  };

  const handleRoomJoin = (room, user) => {
    setCurrentRoom(room);
    setMessages([]); // Clear messages when joining new room
    
    // Simulate adding user to room
    const mockUsers = ['Alice', 'Bob', 'Charlie', user].filter((u, i, arr) => arr.indexOf(u) === i);
    setRoomUsers(mockUsers);
    
    // Add system message
    const systemMessage = {
      type: 'system',
      id: Date.now(),
      message: `${user} joined room: ${room}`,
      timestamp: new Date().toISOString(),
      room: room
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  // Step 4: Room Operations
  const joinRoom = useCallback((roomId, username) => {
    if (socketRef.current && socketRef.current.readyState === 1) {
      const joinData = {
        type: 'join_room',
        room: roomId,
        user: username
      };
      socketRef.current.send(JSON.stringify(joinData));
    }
  }, []);

  const leaveRoom = useCallback(() => {
    if (socketRef.current && currentRoom) {
      const leaveData = {
        type: 'leave_room',
        room: currentRoom
      };
      socketRef.current.send(JSON.stringify(leaveData));
      setCurrentRoom(null);
      setRoomUsers([]);
      setMessages([]);
    }
  }, [currentRoom]);

  const sendMessage = useCallback((message, username) => {
    if (socketRef.current && socketRef.current.readyState === 1 && currentRoom) {
      const messageData = {
        type: 'message',
        message: message,
        user: username,
        room: currentRoom
      };
      socketRef.current.send(JSON.stringify(messageData));
    }
  }, [currentRoom]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  return {
    connectionStatus,
    currentRoom,
    roomUsers,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage,
    connect
  };
};

// Step 5: Main Chat Component
const GroupChatApp = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    connectionStatus,
    currentRoom,
    roomUsers,
    messages,
    joinRoom,
    leaveRoom,
    sendMessage
  } = useWebSocketRoom('ws://localhost:8080', {
    onMessage: (msg) => console.log('New message:', msg),
    onUserJoin: (user) => console.log('User joined:', user),
    onUserLeave: (user) => console.log('User left:', user)
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoinRoom = () => {
    if (username.trim() && roomId.trim()) {
      joinRoom(roomId, username);
      setIsJoined(true);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setIsJoined(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage, username);
      setNewMessage('');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'Connected': return 'bg-green-500';
      case 'Connecting': return 'bg-yellow-500';
      case 'Disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isJoined) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Join Group Chat</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID (e.g., room1, general, etc.)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm text-gray-600">{connectionStatus}</span>
          </div>
          
          <button
            onClick={handleJoinRoom}
            disabled={!username.trim() || !roomId.trim() || connectionStatus !== 'Connected'}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Join Room
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-2">Quick Start:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>1. Enter a username</li>
            <li>2. Enter a room ID (same room = same chat)</li>
            <li>3. Click "Join Room"</li>
            <li>4. Start chatting with others in the room!</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">Room: {currentRoom}</h1>
              <p className="text-blue-100">Welcome, {username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <span className="text-sm">{connectionStatus}</span>
              </div>
              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-96">
          {/* Users Sidebar */}
          <div className="w-1/4 bg-gray-50 p-4 border-r">
            <h3 className="font-medium text-gray-800 mb-3">
              Online Users ({roomUsers.length})
            </h3>
            <div className="space-y-2">
              {roomUsers.map((user, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{user}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="mb-3">
                    {msg.type === 'system' ? (
                      <div className="text-center text-sm text-gray-500 italic">
                        {msg.message}
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-blue-600">{msg.user}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-gray-800">{msg.message}</div>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-medium text-yellow-800 mb-2">How it works:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Users with the same Room ID join the same chat room</li>
          <li>• Messages are broadcast to all users in the room</li>
          <li>• Real-time user presence shows who's online</li>
          <li>• Leave and rejoin rooms as needed</li>
        </ul>
      </div>
    </div>
  );
};

export default GroupChatApp;
```