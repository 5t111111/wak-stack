# WA(C)K Stack

## WACK Stack とは

WACK Stack とは、

- **W**ordPress
- **A**stro
- **C**DN
- **K**ysely

のそれぞれの頭文字をとったもので、高パフォーマンスでスケーラブル、かつデベロッパーフレンドリーなウェブメディア向けの開発スタックとして考えたものです。

### 紹介記事

- [Zenn: ウェブメディアの開発に最高かもしれない WACK Stack の紹介](https://zenn.dev/5t111111/articles/wack-stack-introduction)

### この wak-stack リポジトリについて

WACK Stack の実装例として作ったプロトタイプのリポジトリとなります。

ただ、WACK Stack は CDN も含めて構成されるのに対して、このリポジトリはアプリケーションのコードだけを含んでいます。そのため、**C** は抜きの WAK Stack としています。

## リポジトリ構成

WordPress とフロントエンドのコード両方を含む monorepo 構成になっています。

- cms: WordPress のコード
- frontend: フロントエンドのコード (Astro バージョン)
- frontend-remix: フロントエンドのコード (Remix バージョン)

## ローカル開発環境

VS Code の Dev Container を使う前提です。

Dev Container を起動すると自動的に WordPress の構成やデータベースの初期化が行われます。

開発サーバーの起動手順なども Dev Container の起動コマンドに表示されるので、それを参照してください。
