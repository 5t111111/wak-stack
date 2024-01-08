#!/usr/bin/env bash

set -euo pipefail

WORKSPACE=/workspaces/wack-stack

cat << EOS

================================================================================
CMS のセットアップ
================================================================================
EOS

CMS_DIR=${WORKSPACE}/cms

cd $CMS_DIR

cat << EOS
--------------------------------------------------------------------------------
Composer 依存パッケージのインストール
--------------------------------------------------------------------------------
EOS

composer install

cat << EOS
--------------------------------------------------------------------------------
WordPress の設定
--------------------------------------------------------------------------------
EOS

# Install WordPress
wp core install \
  --url="http://localhost.localdomain" \
  --title="wack-stack" \
  --admin_user="admin" \
  --admin_password="admin" \
  --admin_email="admin@example.com" \
  --skip-email \
  --allow-root

# Activate plugins
wp plugin activate \
  wp-multibyte-patch \
  advanced-custom-fields \
  --allow-root

# Switch language to ja
wp site switch-language ja --allow-root

# Create default categories
# Change existing category
wp term update category 1 --name='カルチャー' --slug=culture --allow-root

# Create new categories
declare -A categories=(
  ['technology']='テクノロジー'
  ['fashion']='ファッション'
  ['sports']='スポーツ'
)

for category_slug in "${!categories[@]}"; do
  if ! wp term get category ${category_slug} --by=slug --allow-root > /dev/null 2>&1; then
    wp term create category "${categories[${category_slug}]}" --slug="${category_slug}" --allow-root
  else
    echo "Category: ${category_slug} already exists."
  fi
done

# Set permalink structure
wp option update permalink_structure '/%postname%/' --allow-root

# Set timezone
wp option update timezone_string 'Asia/Tokyo' --allow-root

# Set date format
wp option update date_format 'Y年n月j日' --allow-root

# Set time format
wp option update time_format 'H:i' --allow-root

# デフォルトで生成される投稿を削除
wp post delete 1 --force --allow-root || true

cat << EOS
--------------------------------------------------------------------------------
データベースにシードを投入
--------------------------------------------------------------------------------
EOS

# Database seeding
CMS_SEED_DIR=${CMS_DIR}/db/seed
cd ${CMS_SEED_DIR}

if [ ! -f .seeded ]; then
  ./seed.bash
  touch .seeded
  echo "シードを投入しました。"
else
  echo "すでにデータベースにシードが投入されています。"
  echo "再実行したい場合は、${CMS_SEED_DIR}/.seeded ファイルを削除してください。"
fi

cat << EOS

================================================================================
Frontend のセットアップ
================================================================================
EOS

FRONTEND_DIR=${WORKSPACE}/frontend
cd ${FRONTEND_DIR}

cat << EOS
--------------------------------------------------------------------------------
NPM 依存パッケージのインストール
--------------------------------------------------------------------------------
EOS

npm install

# cat << EOS
# --------------------------------------------------------------------------------
# WordPress データベースから Kysely 用のスキーマ型定義を作成
# --------------------------------------------------------------------------------
# EOS
# npx kysely-codegen

cat << EOS
================================================================================
セットアップ完了
================================================================================
EOS

echo -e 'Dev Container のセットアップが完了しました。'
echo -e '以下の手順で Astro のサーバーを実行し、http://localhost:4321 にアクセスして確認してください。'
echo -e ''
echo -e 'frontend ディレクトリに移動'
echo -e '\033[0;36m$ cd frontend\033[0m'
echo -e ''
echo -e 'Astro 開発サーバーの起動'
echo -e '\033[0;36m$ npm run dev\033[0m'
echo -e ''
echo -e 'WordPress 管理画面には http://localhost.localdomain/wp/wp-login.php' でアクセスできます。以下の初期管理者でログインしてください。
echo -e ''
echo -e 'User: \033[0;36madmin\033[0m'
echo -e 'Password: \033[0;36madmin\033[0m'
echo -e ''
