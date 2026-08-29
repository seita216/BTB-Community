const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

module.exports = function(db) {
  const router = express.Router();
  const ADMINS = (process.env.ADMINS || 'Seita-2015-0216,hikinikuunnma').split(',');
  const SCRATCH_API = process.env.SCRATCH_API_BASE || 'https://api.scratch.mit.edu';

  // Verify admin by Scratch profile code
  router.post('/verify-admin', async (req, res) => {
    try {
      const { username, auth_code } = req.body;

      if (!ADMINS.includes(username)) {
        return res.status(403).json({ error: '管理者ユーザーではありません' });
      }

      // Fetch Scratch user profile
      const response = await axios.get(`${SCRATCH_API}/users/${username}`);
      const profile = response.data;

      // Check if auth code is in bio (first part of description)
      const bio = profile.bio || '';
      if (!bio.includes(auth_code)) {
        return res.status(401).json({ error: '認証コードが見つかりません' });
      }

      res.json({
        success: true,
        user: {
          username,
          id: profile.id,
          avatar: profile.profile.images.medium,
          is_admin: true
        }
      });
    } catch (error) {
      res.status(500).json({ error: '認証に失敗しました' });
    }
  });

  // Create anonymous session
  router.post('/anonymous-session', async (req, res) => {
    try {
      const sessionId = uuidv4();
      
      // Check if banned
      const banned = await db.get(
        'SELECT * FROM sessions WHERE id = ? AND is_banned = 1',
        [sessionId]
      );

      if (banned) {
        return res.status(403).json({ error: 'このセッションはバンされています' });
      }

      await db.run(
        'INSERT INTO sessions (id) VALUES (?)',
        [sessionId]
      );

      res.json({
        success: true,
        session_id: sessionId,
        is_anonymous: true
      });
    } catch (error) {
      res.status(500).json({ error: 'セッション作成に失敗しました' });
    }
  });

  return router;
};
