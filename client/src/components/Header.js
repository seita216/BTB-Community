import React, { useState } from 'react';
import axios from 'axios';

function Header({ isAdmin, adminUser, onLogout }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !authCode.trim()) {
      setError('ユーザー名と認証コードを入力してください');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-admin', {
        username,
        auth_code: authCode
      });

      if (response.data.success) {
        setShowLoginModal(false);
        setUsername('');
        setAuthCode('');
        setError('');
      }
    } catch (error) {
      setError(error.response?.data?.error || '認証に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="header">
      <div className="header-title">🎮 BTB Community</div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isAdmin ? (
          <>
            <span className="admin-badge">⭐ 管理者: {adminUser?.username}</span>
            <button 
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                background: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#ff9800'
              }}
            >
              ログアウト
            </button>
          </>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            style={{
              padding: '10px 20px',
              background: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              color: '#ffc107'
            }}
          >
            👤 管理者ログイン
          </button>
        )}
      </div>

      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ color: '#ff9800', marginBottom: '20px' }}>管理者認証</h2>
            
            <form onSubmit={handleAdminLogin}>
              <div className="form-group">
                <label>Scratchユーザー名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="例: Seita-2015-0216"
                />
              </div>

              <div className="form-group">
                <label>認証コード</label>
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="Scratchプロフィールの上部に設置したコード"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? '認証中...' : '認証'}
              </button>
            </form>

            <button
              onClick={() => setShowLoginModal(false)}
              style={{
                marginTop: '15px',
                width: '100%',
                padding: '10px',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
