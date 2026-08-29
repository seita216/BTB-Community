import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatRoom({ sessionId, isAdmin }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chat/messages');
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/chat/messages', {
        session_id: sessionId,
        content: input,
        is_anonymous: true
      });

      if (response.data.success) {
        setInput('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('メッセージ送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-room">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', paddingTop: '20px' }}>
            💬 まだメッセージはありません
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.is_anonymous ? 'anonymous' : ''}`}>
              <div className="message-author">
                {msg.is_anonymous ? '匿名ユーザー' : msg.scratch_username}
              </div>
              <div className="message-content">{msg.content}</div>
              <div className="message-time">
                {new Date(msg.created_at).toLocaleString('ja-JP')}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力...（匿名で送信されます）"
          disabled={loading}
        />
        <button type="submit" className="send-btn" disabled={loading}>
          {loading ? '送信中...' : '送信'}
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;
