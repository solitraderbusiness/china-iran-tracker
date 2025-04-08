import React, { useState, useEffect } from 'react';

const WebSocketTest = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    // Connect to WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/1`); // Using test user ID 1
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setConnected(true);
      setMessages(prev => [...prev, 'Connected to WebSocket server']);
    };
    
    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      try {
        const data = JSON.parse(event.data);
        setMessages(prev => [...prev, `Received: ${JSON.stringify(data)}`]);
      } catch (e) {
        setMessages(prev => [...prev, `Received: ${event.data}`]);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages(prev => [...prev, 'WebSocket error occurred']);
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
      setConnected(false);
      setMessages(prev => [...prev, 'Disconnected from WebSocket server']);
    };
    
    setSocket(ws);
    
    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  const sendTestMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN && testMessage) {
      socket.send(testMessage);
      setMessages(prev => [...prev, `Sent: ${testMessage}`]);
      setTestMessage('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">WebSocket Testing</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center mb-4">
          <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
        
        <div className="mb-4">
          <label htmlFor="test-message" className="block text-sm font-medium text-gray-700 mb-1">
            Test Message
          </label>
          <div className="flex">
            <input
              type="text"
              id="test-message"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a test message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
            />
            <button
              onClick={sendTestMessage}
              disabled={!connected || !testMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md disabled:bg-gray-400"
            >
              Send
            </button>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Message Log</h3>
          <div className="bg-gray-100 p-4 rounded-md h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet</p>
            ) : (
              <ul className="space-y-2">
                {messages.map((msg, index) => (
                  <li key={index} className="text-sm">
                    {msg}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest;
