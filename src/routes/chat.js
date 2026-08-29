const express = require('express');

module.exports = function(db) {
  const router = express.Router();

  // Post message
  router.post('/messages', async (req, res) => {
    try {
      const { session_id, user_id, content, is_anonymous } = req.body;

      // Check if banned
      if (session_id) {
        const banned = await db.get(
          'SELECT * FROM sessions WHERE id = ? AND is_banned = 1',
          [session_id]
        );
        if (banned) {
          return res.status(403).json({ error: 'バンされています' });
        }
      }

      if (user_id) {
        const bannedUser = await db.get(
          'SELECT * FROM users WHERE id = ? AND is_banned = 1',
          [user_id]
        );
        if (bannedUser) {
          return res.status(403).json({ error: 'バンされています' });
        }
      }

      const result = await db.run(
        'INSERT INTO messages (user_id, session_id, is_anonymous, content) VALUES (?, ?, ?, ?)',
        [user_id || null, session_id || null, is_anonymous ? 1 : 0, content]
      );

      res.json({
        success: true,
        message_id: result.lastID,
        timestamp: new Date()
      });
    } catch (error) {
      res.status(500).json({ error: 'メッセージ送信に失敗しました' });
    }
  });

  // Get all messages
  router.get('/messages', async (req, res) => {
    try {
      const messages = await db.all(
        `SELECT m.*, u.scratch_username, u.avatar_url 
         FROM messages m 
         LEFT JOIN users u ON m.user_id = u.id 
         ORDER BY m.created_at DESC 
         LIMIT 100`,
        []
      );

      res.json({
        success: true,
        messages: messages.reverse()
      });
    } catch (error) {
      res.status(500).json({ error: 'メッセージ取得に失敗しました' });
    }
  });

  return router;
};
