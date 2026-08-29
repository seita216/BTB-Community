import React, { useState } from 'react';
import axios from 'axios';

function AdminPanel({ adminUser }) {
  const [updates, setUpdates] = useState([]);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [banType, setBanType] = useState('session');
  const [banTarget, setBanTarget] = useState('');
  const [banReason, setBanReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const showMessage = (message, isError = false) => {
    if (isError) {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(''), 3000);
    } else {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateContent.trim()) {
      showMessage('タイトルと内容を入力してください', true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/admin/updates', {
        admin_user: adminUser.username,
        title: updateTitle,
        content: updateContent
      });

      if (response.data.success) {
        showMessage('✅ アップデート情報を公開しました');
        setUpdateTitle('');
        setUpdateContent('');
      }
    } catch (error) {
      showMessage('❌ アップデート公開に失敗しました', true);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (e) => {
    e.preventDefault();
    if (!banTarget.trim()) {
      showMessage('対象を入力してください', true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/admin/ban', {
        admin_user: adminUser.username,
        target_type: banType,
        target_value: banTarget,
        reason: banReason
      });

      if (response.data.success) {
        showMessage('✅ ユーザーをバンしました');
        setBanTarget('');
        setBanReason('');
      }
    } catch (error) {
      showMessage('❌ バン処理に失敗しました', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      {successMsg && <div className="success-message">{successMsg}</div>}
      {errorMsg && <div className="error-message">{errorMsg}</div>}

      {/* Server Management Section */}
      <div className="admin-section">
        <div className="section-title">⚙️ サーバー管理</div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#ff9800', marginBottom: '15px' }}>🔨 バン処理</h3>
          <form onSubmit={handleBan}>
            <div className="form-group">
              <label>バン対象の種類</label>
              <select value={banType} onChange={(e) => setBanType(e.target.value)}>
                <option value="session">セッションID</option>
                <option value="username">ユーザー名</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                {banType === 'session' ? 'セッションID' : 'Scratchユーザー名'}
              </label>
              <input
                type="text"
                value={banTarget}
                onChange={(e) => setBanTarget(e.target.value)}
                placeholder={banType === 'session' ? 'UUID...' : 'username...'}
              />
            </div>

            <div className="form-group">
              <label>バン理由（オプション）</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="理由を入力..."
              />
            </div>

            <button type="submit" className="btn-submit btn-danger" disabled={loading}>
              {loading ? '処理中...' : '🚫 バンする'}
            </button>
          </form>
        </div>
      </div>

      {/* Update Management Section */}
      <div className="admin-section">
        <div className="section-title">📢 アップデート情報の書き込み</div>
        <form onSubmit={handlePostUpdate}>
          <div className="form-group">
            <label>タイトル</label>
            <input
              type="text"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              placeholder="例: v1.2.0 リリース"
            />
          </div>

          <div className="form-group">
            <label>内容</label>
            <textarea
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
              placeholder="アップデート内容を入力..."
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '公開中...' : '📝 アップデート情報を公開'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
