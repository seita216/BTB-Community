# セットアップガイド

## クイックスタート（5分で完成）

### ステップ 1: リポジトリをクローン

```bash
git clone https://github.com/seita216/BTB-Community.git
cd BTB-Community
```

### ステップ 2: バックエンドをセットアップ

```bash
# 依存パッケージをインストール
npm install

# .env ファイルを作成
cp .env.example .env

# バックエンドを起動
npm start
```

ターミナルに `🚀 BTB Community Platform running on port 5000` と表示されればOKです。

### ステップ 3: フロントエンドをセットアップ

別のターミナルを開いて：

```bash
cd client

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm start
```

ブラウザが自動で http://localhost:3000 に開きます。

---

## 🔑 管理者アカウントの設定

### 前提条件
ユーザー名が `Seita-2015-0216` または `hikinikuunnma` である必要があります。

### 認証手順

1. **Scratch プロフィールを編集**
   - https://scratch.mit.edu/accounts/settings/ にアクセス
   - 「バイオ」セクションに認証用コードを追加
   ```
   例: BTB_ADMIN_AUTH_CODE_12345
   ```

2. **BTB Community で ログイン**
   - ヘッダーの「👤 管理者ログイン」をクリック
   - Scratchユーザー名を入力
   - バイオに記載したコードを入力
   - 「認証」をクリック

3. **✅ 管理画面にアクセス**
   - ログイン成功後、管理者パネルが表示されます

---

## 📋 管理者機能の使い方

### 1. ユーザーをバンする

**セッション ID でバン：**
- 匿名ユーザーをバンする場合
- バン対象の種類: 「セッションID」を選択
- セッション ID を入力（ユーザーのブラウザコンソール確認可）
- バン理由を入力（オプション）
- 「🚫 バンする」をクリック

**ユーザー名でバン：**
- Scratchアカウント連携ユーザーをバンする場合
- バン対象の種類: 「ユーザー名」を選択
- Scratchユーザー名を入力
- バン理由を入力（オプション）
- 「🚫 バンする」をクリック

### 2. アップデート情報を公開

1. 管理画面の「📢 アップデート情報の書き込み」セクションへ
2. タイトルを入力（例: `v1.2.0 リリース`）
3. 内容を入力（詳細な更新情報）
4. 「📝 アップデート情報を公開」をクリック
5. ✅ 成功メッセージが表示され、ユーザーが見る「📢 アップデート」タブに反映

---

## 🎨 UI カスタマイズ

### カラーテーマを変更したい

`client/src/App.css` を編集：

```css
/* メインカラー */
background: linear-gradient(90deg, #ffc107 0%, #ffb300 100%);

/* 代替色例：
青：#2196F3
緑：#4CAF50
赤：#f44336
ピンク：#E91E63
*/
```

---

## 🚀 本番環境へのデプロイ

### Heroku にデプロイ（推奨）

```bash
# Heroku にログイン
heroku login

# アプリを作成
heroku create btb-community-prod

# リモートを追加
heroku git:remote -a btb-community-prod

# デプロイ
git push heroku main

# ログを確認
heroku logs --tail

# アプリを開く
heroku open
```

### Vercel にデプロイ（フロントエンドのみ）

```bash
cd client
npm install -g vercel
vercel
```

### AWS Lambda + DynamoDB でデプロイ

詳細は別のガイドを参照してください。

---

## 🐛 デバッグ

### ブラウザコンソールを開く
- Windows: `F12` または `Ctrl+Shift+J`
- Mac: `Cmd+Option+J`
- Linux: `Ctrl+Shift+J`

### セッション ID を確認

コンソールで以下を実行：
```javascript
const sessionId = localStorage.getItem('sessionId');
console.log(sessionId);
```

### バックエンドログを確認

```bash
# バックエンドターミナルで確認
# または
npm start
```

---

## ❓ よくある質問

**Q: 匿名で投稿できますか？**

A: はい。セッション ID が自動生成されるため、ログインなしで投稿できます。

**Q: 投稿を削除できますか？**

A: 現在は管理者のみが削除可能です（将来のアップデートで実装予定）。

**Q: スマートフォンで使えますか？**

A: はい。完全なレスポンシブデザインです。

**Q: データベースをリセットしたい**

A: `data/btb.sqlite` を削除して、サーバーを再起動してください。

---

## 📞 サポート

問題が発生した場合は：
1. このガイドの「🐛 デバッグ」セクションを確認
2. ブラウザコンソールでエラーメッセージを確認
3. GitHub Issues で報告

---

**BTB Community Platform** - 楽しいコミュニティを作ろう！🎮✨
