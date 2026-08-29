import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ChatRoom from './components/ChatRoom';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import UpdatesFeed from './components/UpdatesFeed';

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState('chat');
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Initialize anonymous session
    const initSession = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/anonymous-session');
        setSessionId(response.data.session_id);
      } catch (error) {
        console.error('Session initialization failed:', error);
      }
    };

    initSession();
  }, []);

  const handleAdminLogin = (user) => {
    setIsAdmin(true);
    setAdminUser(user);
    setCurrentPage('admin');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setAdminUser(null);
    setCurrentPage('chat');
  };

  return (
    <div className="App">
      <Header isAdmin={isAdmin} adminUser={adminUser} onLogout={handleLogout} />
      
      <nav className="nav-bar">
        <button 
          className={`nav-btn ${currentPage === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentPage('chat')}
        >
          💬 チャット
        </button>
        <button 
          className={`nav-btn ${currentPage === 'updates' ? 'active' : ''}`}
          onClick={() => setCurrentPage('updates')}
        >
          📢 アップデート
        </button>
        {isAdmin && (
          <button 
            className={`nav-btn ${currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => setCurrentPage('admin')}
          >
            ⚙️ 管理画面
          </button>
        )}
      </nav>

      <main className="main-content">
        {currentPage === 'chat' && <ChatRoom sessionId={sessionId} isAdmin={isAdmin} />}
        {currentPage === 'updates' && <UpdatesFeed />}
        {currentPage === 'admin' && isAdmin && <AdminPanel adminUser={adminUser} />}
      </main>
    </div>
  );
}

export default App;
