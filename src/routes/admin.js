const express = require('express');

module.exports = function(db) {
  const router = express.Router();
  const ADMINS = (process.env.ADMINS || 'Seita-2015-0216,hikinikuunnma').split(',');

  // Middleware to check admin
  const requireAdmin = (req, res, next) => {
    const { admin_user } = req.body;
    if (!ADMINS.includes(admin_user)) {
      return res.status(403).json({ error: '管理者のみアクセス可能です' });
    }
    next();
  };

  // Post update
  router.post('/updates', requireAdmin, async (req, res) => {
    try {
      const { admin_user, title, content } = req.body;

      await db.run(
        'INSERT INTO updates (admin_user, title, content) VALUES (?, ?, ?)',
        [admin_user, title, content]
      );

      res.json({ success: true, message: 'アップデート情報を公開しました' });
    } catch (error) {
      res.status(500).json({ error: 'アップデート公開に失敗しました' });
    }
  });

  // Get updates
  router.get('/updates', async (req, res) => {
    try {
      const updates = await db.all(
        'SELECT * FROM updates ORDER BY created_at DESC',
        []
      );

      res.json({ success: true, updates });
    } catch (error) {
      res.status(500).json({ error: 'アップデート取得に失敗しました' });
    }
  });

  // Ban user by session or username
  router.post('/ban', requireAdmin, async (req, res) => {
    try {
      const { admin_user, target_type, target_value, reason } = req.body;

      if (target_type === 'session') {
        await db.run(
          'UPDATE sessions SET is_banned = 1, banned_at = CURRENT_TIMESTAMP WHERE id = ?',
          [target_value]
        );
      } else if (target_type === 'username') {
        await db.run(
          'UPDATE users SET is_banned = 1, ban_reason = ?, banned_at = CURRENT_TIMESTAMP WHERE scratch_username = ?',
          [reason, target_value]
        );
      }

      res.json({ success: true, message: 'バンしました' });
    } catch (error) {
      res.status(500).json({ error: 'バン処理に失敗しました' });
    }
  });

  // Unban
  router.post('/unban', requireAdmin, async (req, res) => {
    try {
      const { admin_user, target_type, target_value } = req.body;

      if (target_type === 'session') {
        await db.run(
          'UPDATE sessions SET is_banned = 0 WHERE id = ?',
          [target_value]
        );
      } else if (target_type === 'username') {
        await db.run(
          'UPDATE users SET is_banned = 0 WHERE scratch_username = ?',
          [target_value]
        );
      }

      res.json({ success: true, message: 'バンを解除しました' });
    } catch (error) {
      res.status(500).json({ error: 'バン解除に失敗しました' });
    }
  });

  return router;
};
