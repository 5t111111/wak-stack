<?php

// 初期設定
add_theme_support('post-thumbnails');

// 連載のカスタム投稿タイプを追加
add_action('init', function () {
    $labels = [
        'name' => __('連載'),
        'add_new' => '新規連載追加',
        'add_new_item' => '新規連載を追加',
        'edit_item' => '連載を編集',
        'new_item' => '新規連載',
        'view_item' => '連載を表示',
        'search_items' => '連載を検索',
    ];

    register_post_type(
        "series",
        [
            'labels' => $labels,
            'public' => true,
            'show_ui' => true,
            'menu_position' => 5,
            'supports' => [ 'title', 'thumbnail' ],
            'menu_icon' => 'dashicons-list-view',
         ]
    );
});

// 著者のカスタム投稿タイプを追加
add_action('init', function () {
    $labels = [
        'name' => __('著者'),
        'add_new' => '新規著者追加',
        'add_new_item' => '新規著者を追加',
        'edit_item' => '著者を編集',
        'new_item' => '新規著者',
        'view_item' => '著者を表示',
        'search_items' => '著者を検索',
    ];

    register_post_type(
        "author",
        [
            'labels' => $labels,
            'public' => true,
            'show_ui' => true,
            'menu_position' => 6,
            'supports' => [ 'title', 'thumbnail' ],
            'menu_icon' => 'dashicons-businessperson',
         ]
    );
});
