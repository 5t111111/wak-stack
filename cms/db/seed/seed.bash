#!/bin/bash

export WP_CLI_ALLOW_ROOT=true

# CSVファイルのパス
AUTHORS_CSV="authors.csv"
POSTS_CSV="posts.csv"
SERIES_CSV="series.csv"

# 'author' タイプの投稿を追加
tail -n +2 "$AUTHORS_CSV" | while IFS=, read -r title featured_image_path profile
do
  # 同じタイトルの投稿が存在するか確認
  existing_post_id=$(wp post list --post_type=author --title="$title" --field=ID --posts_per_page=1)

  # 既存の投稿がない場合のみ処理を実行
  if [ -z "$existing_post_id" ]; then
    # 投稿を作成
    author_id=$(wp post create --post_type=author --post_title="$title" --post_status=publish --porcelain)

    # アイキャッチ画像を設定
    wp media import "$featured_image_path" --post_id="$author_id" --featured_image

    # ACFフィールドへのデータ追加
    wp eval "update_field('author_profile', '$profile', $author_id);"
  fi
done

# 'post' タイプの投稿を追加
tail -n +2 "$POSTS_CSV" | while IFS=, read -r title content featured_image_path description author category
do
  # 同じタイトルの投稿が存在するか確認
  existing_post_id=$(wp post list --post_type=post --title="$title" --field=ID --posts_per_page=1)

  # 既存の投稿がない場合のみ処理を実行
  if [ -z "$existing_post_id" ]; then
    # 投稿を作成
    post_id=$(wp post create --post_type=post --post_title="$title" --post_content="$content" --post_status=publish --porcelain)

    # アイキャッチ画像を設定
    wp media import "$featured_image_path" --post_id="$post_id" --featured_image

    # ACF description フィールドへのデータ追加
    wp eval "update_field('post_description', '$description', $post_id);"

    # author の名前から ID を取得
    author_id=$(wp post list --post_type=author --title="$author" --field=ID --posts_per_page=1)
    # ACF author フィールドへのデータ追加
    wp eval "update_field('post_author', ['$author_id'], $post_id);"

    # カテゴリーを設定
    wp post term set "$post_id" category "$category"
  fi
done

# 'series' タイプの投稿を追加
tail -n +2 "$SERIES_CSV" | while IFS=, read -r title featured_image_path description author posts
do
  # 同じタイトルの投稿が存在するか確認
  existing_post_id=$(wp post list --post_type=series --title="$title" --field=ID --posts_per_page=1)

  # 既存の投稿がない場合のみ処理を実行
  if [ -z "$existing_post_id" ]; then
    # 投稿を作成
    post_id=$(wp post create --post_type=series --post_title="$title" --post_status=publish --porcelain)

    # アイキャッチ画像を設定
    wp media import "$featured_image_path" --post_id="$post_id" --featured_image

    # ACF description フィールドへのデータ追加
    wp eval "update_field('series_description', '$description', $post_id);"

    # author の名前から ID を取得
    author_id=$(wp post list --post_type=author --title="$author" --field=ID --posts_per_page=1)
    # ACF author フィールドへのデータ追加
    wp eval "update_field('series_author', ['$author_id'], $post_id);"

    # posts フィールドに追加する記事IDの配列を作成
    IFS='|' read -ra post_titles <<< "$posts"
    post_ids=()
    for post_title in "${post_titles[@]}"; do
      post_title_trimmed=$(echo $post_title | xargs)
      post_id_in_series=$(wp post list --post_type=post --title="$post_title_trimmed" --field=ID --posts_per_page=1)
      if [ ! -z "$post_id_in_series" ]; then
        post_ids+=("'$post_id_in_series'")
      fi
    done

    # ACF posts フィールドへのデータ追加 (コンマ区切りの文字列として結合)
    posts_string=$(IFS=,; echo "${post_ids[*]}")
    wp eval "update_field('series_posts', [$posts_string], $post_id);"
  fi
done
