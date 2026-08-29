# 🎮 BTB Community Platform

**BTB（ゲーム名）専用の企業レベルのゲーミングコミュニティプラットフォーム**

黄色ベースの美しいUIで、Discord風の掲示板・チャット機能を備えています。

## 🌟 機能

### 👥 ユーザー機能
- **匿名チャット**: セッションIDで自動生成、登録不要
- **リアルタイム更新**: メッセージは2秒ごとに自動更新
- **Scratch連携**: ユーザーのScratchプロフィール表示対応

### 🔐 管理者機能（`Seita-2015-0216` / `hikinikuunnma` のみ）
- **認証**: Scratchプロフィールのバイオにコードを記載して本人確認
- **バン管理**: 
  - セッションID単位でバン
  - ユーザー名単位でバン
  - バン理由の記録
- **アップデート公開**: ゲーム更新情報を投稿・表示
- **サーバー管理**: ユーザーとセッションの一元管理

## 🎨 デザイン
- **カラーテーマ**: 黄色（#ffc107）＆ オレンジ（#ff9800）
- **レスポンシブ**: PC・タブレット・スマートフォン対応
- **企業レベルUI**: プロフェッショナルで使いやすい設計

## 🚀 インストール & セットアップ

### 前提条件
- Node.js v16 以上
- npm または yarn

### バックエンド設定

```bash
# リポジトリをクローン
git clone https://github.com/seita216/BTB-Community.git
cd BTB-Community

# 依存パッケージをインストール
npm install

# .env ファイルを作成
cp .env.example .env

# .env を編集（必要に応じて）
# PORT=5000
# ADMINS=Seita-2015-0216,hikinikuunnma

# バックエンドサーバーを起動
npm start
# http://localhost:5000 で起動
```

### フロントエンド設定

```bash
# 別ターミナルで
cd client

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm start
# http://localhost:3000 で起動
```

## 🔑 管理者ログイン方法

1. ヘッダーの「👤 管理者ログイン」をクリック
2. Scratchユーザー名を入力（例: `Seita-2015-0216`）
3. **Scratchプロフィール（プロフィール > バイオ）に特定のコードを記載**
4. そのコードを入力して認証
5. ✅ 認証成功で管理画面にアクセス可能

### 認証コード設定方法

1. https://scratch.mit.edu/users/[ユーザー名]/ にアクセス
2. プロフィール編集 → バイオに認証用コードを記載
   ```
   例: BTB_ADMIN_KEY_12345
   ```
3. そのコードでログイン

## 📖 API ドキュメント

### 認証 API

#### 匿名セッション作成
```bash
POST /api/auth/anonymous-session

レスポンス:
{
  "success": true,
  "session_id": "uuid-here",
  "is_anonymous": true
}
```

#### 管理者認証
```bash
POST /api/auth/verify-admin

リクエスト:
{
  "username": "Seita-2015-0216",
  "auth_code": "BTB_ADMIN_KEY_12345"
}

レスポンス:
{
  "success": true,
  "user": {
    "username": "Seita-2015-0216",
    "id": 123456,
    "avatar": "https://...",
    "is_admin": true
  }
}
```

### チャット API

#### メッセージ送信
```bash
POST /api/chat/messages

リクエスト:
{
  "session_id": "uuid",
  "content": "メッセージ内容",
  "is_anonymous": true
}

レスポンス:
{
  "success": true,
  "message_id": 1,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### メッセージ取得
```bash
GET /api/chat/messages

レスポンス:
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "content": "メッセージ",
      "is_anonymous": 1,
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### 管理 API

#### アップデート情報投稿
```bash
POST /api/admin/updates

リクエスト:
{
  "admin_user": "Seita-2015-0216",
  "title": "v1.2.0 リリース",
  "content": "新機能追加..."
}
```

#### ユーザーをバン
```bash
POST /api/admin/ban

リクエスト:
{
  "admin_user": "Seita-2015-0216",
  "target_type": "session" or "username",
  "target_value": "uuid or username",
  "reason": "バン理由"
}
```

#### バンを解除
```bash
POST /api/admin/unban

リクエスト:
{
  "admin_user": "Seita-2015-0216",
  "target_type": "session" or "username",
  "target_value": "uuid or username"
}
```

## 📁 ディレクトリ構造

```
BTB-Community/
├── server.js                    # メインサーバーファイル
├── package.json                 # Node.js依存パッケージ
├── .env.example                 # 環境変数テンプレート
├── src/
│   ├── database.js              # SQLiteデータベース設定
│   └── routes/
│       ├── auth.js              # 認証API
│       ├── chat.js              # チャットAPI
│       └── admin.js             # 管理者API
├── client/                      # Reactフロントエンド
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js               # メインアプリケーション
│       ├── App.css              # スタイル（黄色ベース）
│       ├── index.js
│       └── components/
│           ├── ChatRoom.js      # チャット画面
│           ├── AdminPanel.js    # 管理者パネル
│           ├── UpdatesFeed.js   # アップデート表示
│           └── Header.js        # ヘッダー
├── data/                        # SQLiteデータベース
│   └── btb.sqlite
└── README.md                    # このファイル
```

## 🗄️ データベーススキーマ

### users テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | ユーザーID（主キー） |
| scratch_username | TEXT | Scratchユーザー名 |
| scratch_id | INTEGER | Scratch ID |
| avatar_url | TEXT | プロフィール画像 |
| is_banned | INTEGER | バンフラグ |
| ban_reason | TEXT | バン理由 |
| banned_at | DATETIME | バン日時 |
| created_at | DATETIME | 作成日時 |

### sessions テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | TEXT | セッションID（UUID） |
| is_banned | INTEGER | バンフラグ |
| banned_at | DATETIME | バン日時 |
| created_at | DATETIME | 作成日時 |

### messages テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | メッセージID |
| user_id | INTEGER | ユーザーID（外部キー） |
| session_id | TEXT | セッションID |
| is_anonymous | INTEGER | 匿名フラグ |
| content | TEXT | メッセージ内容 |
| created_at | DATETIME | 作成日時 |

### updates テーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | INTEGER | アップデートID |
| admin_user | TEXT | 投稿管理者 |
| title | TEXT | タイトル |
| content | TEXT | 内容 |
| created_at | DATETIME | 作成日時 |

## 🛠️ トラブルシューティング

### ポート 5000 が既に使用されている
```bash
# 別のポートを使用
PORT=3001 npm start
```

### 認証に失敗する
- Scratchプロフィール（バイオ）に認証コードが記載されているか確認
- ユーザー名の大文字小文字を確認（Scratchは大文字小文字を区別します）
- ネットワーク接続を確認

### メッセージが表示されない
- ブラウザのコンソールでエラーを確認
- バックエンド・フロントエンドサーバーが両方起動しているか確認
- CORS設定を確認（`.env` で正しい SCRATCH_API_BASE を設定）

## 📦 デプロイ

### Heroku へのデプロイ

```bash
# Heroku CLIをインストール
npm install -g heroku

# ログイン
heroku login

# アプリを作成
heroku create btb-community

# デプロイ
git push heroku main

# ログを確認
heroku logs --tail
```

### Vercel へのデプロイ（フロントエンドのみ）

```bash
cd client
npm install -g vercel
vercel
```

## 📝 ライセンス

MIT License - 詳細は LICENSE ファイルを参照してください

## 👨‍💻 開発者

- **プロジェクトリーダー**: seita216
- **管理者**: Seita-2015-0216, hikinikuunnma

## 🤝 サポート

問題が発生した場合は、GitHubのIssuesセクションで報告してください。

---

**BTB Community Platform** - ゲーマーのための、ゲーマーによる、コミュニティプラットフォーム 🎮✨
