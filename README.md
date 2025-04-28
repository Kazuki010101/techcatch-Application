# TechCatch Application

**TechCatch Application** は、エンジニア向けの技術情報を素早くキャッチアップできることを目的としたWebアプリケーションです。主にQiita, Zenn, Noteから情報を取得することができ、それぞれの記事のトレンドになっている記事を取得して管理できます。

---

## アプリケーションを構成するページ一覧


![メインページ](img/MainScreen.png)
![検索ページ](img/SearchScreen.png)
![お気に入りページ](img/FavoriteScreen.png)
![トレンドページ](img/TrendScreen.png)

---

## フロントエンド構成

- `frontend/src/` - Reactコンポーネント群、本体ロジック 
- `frontend/src/components` - UIコンポーネント
- `frontend/utils/` - src/componentsの中で共通する関数群
- `frontend/package.json` - フロントエンドの依存関係とスクリプト定義
- `frontend/src/App.jsx` - ルーティングと全体レイアウトを管理するメインコンポーネント

---

## バックエンド構成

- `backend/settings.py` - Djangoプロジェクト設定ファイル
- `backend/urls.py` - ルーティング設定ファイル

---

## Djangoアプリの本体
- `tech_catch/scraper/` - 複数サイトからデータを取得するモジュール群
- `tech_catch/views.py` - APIエンドポイント処理
- `tech_catch/urls.py` - ルーティング設定ファイル
- `tech_catch/models.py` - データベースモデル定義

---

## Point

ユーザーが「おすすめ記事」をリクエストした際、待ち時間を極力減らすため、スクレイピング処理をバックエンドで並列実行する設計にしました。これにより、複数サイトからデータを集める場合でもレスポンスが遅くならず、ユーザーにとってストレスのない動作を実現しています。万が一、特定サイトの取得に失敗しても、他サイトのデータ取得に影響を与えない設計とし、ユーザーに対してできるだけ多くの情報を提供できるようにしています。