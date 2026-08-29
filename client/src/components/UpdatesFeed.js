import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdatesFeed() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchUpdates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/updates');
      if (response.data.success) {
        setUpdates(response.data.updates);
      }
    } catch (error) {
      console.error('Failed to fetch updates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>📡 読み込み中...</div>;
  }

  return (
    <div className="updates-feed">
      {updates.length === 0 ? (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#999' }}>
          📭 アップデート情報はまだありません
        </div>
      ) : (
        updates.map((update) => (
          <div key={update.id} className="update-card">
            <div className="update-title">📌 {update.title}</div>
            <div className="update-content">{update.content}</div>
            <div className="update-admin">
              👤 {update.admin_user} - {new Date(update.created_at).toLocaleString('ja-JP')}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default UpdatesFeed;
