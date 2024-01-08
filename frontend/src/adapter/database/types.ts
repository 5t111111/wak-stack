/**
 * kysely-codegen で生成した型定義をコピペして作ったもの
 * WP の DB スキーマはそう変わらないが、更新があった際には再生成すること
 */
import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export interface WpCommentmeta {
  comment_id: Generated<number>;
  meta_id: Generated<number>;
  meta_key: string | null;
  meta_value: string | null;
}

export interface WpComments {
  comment_agent: Generated<string>;
  comment_approved: Generated<string>;
  comment_author: string;
  comment_author_email: Generated<string>;
  comment_author_IP: Generated<string>;
  comment_author_url: Generated<string>;
  comment_content: string;
  comment_date: Generated<Date>;
  comment_date_gmt: Generated<Date>;
  comment_ID: Generated<number>;
  comment_karma: Generated<number>;
  comment_parent: Generated<number>;
  comment_post_ID: Generated<number>;
  comment_type: Generated<string>;
  user_id: Generated<number>;
}

export interface WpLinks {
  link_description: Generated<string>;
  link_id: Generated<number>;
  link_image: Generated<string>;
  link_name: Generated<string>;
  link_notes: string;
  link_owner: Generated<number>;
  link_rating: Generated<number>;
  link_rel: Generated<string>;
  link_rss: Generated<string>;
  link_target: Generated<string>;
  link_updated: Generated<Date>;
  link_url: Generated<string>;
  link_visible: Generated<string>;
}

export interface WpOptions {
  autoload: Generated<string>;
  option_id: Generated<number>;
  option_name: Generated<string>;
  option_value: string;
}

export interface WpPostmeta {
  meta_id: Generated<number>;
  meta_key: string | null;
  meta_value: string | null;
  post_id: Generated<number>;
}

export interface WpPosts {
  comment_count: Generated<number>;
  comment_status: Generated<string>;
  guid: Generated<string>;
  ID: Generated<number>;
  menu_order: Generated<number>;
  ping_status: Generated<string>;
  pinged: string;
  post_author: Generated<number>;
  post_content: string;
  post_content_filtered: string;
  post_date: Generated<Date>;
  post_date_gmt: Generated<Date>;
  post_excerpt: string;
  post_mime_type: Generated<string>;
  post_modified: Generated<Date>;
  post_modified_gmt: Generated<Date>;
  post_name: Generated<string>;
  post_parent: Generated<number>;
  post_password: Generated<string>;
  post_status: Generated<string>;
  post_title: string;
  post_type: Generated<string>;
  to_ping: string;
}

export interface WpTermmeta {
  meta_id: Generated<number>;
  meta_key: string | null;
  meta_value: string | null;
  term_id: Generated<number>;
}

export interface WpTermRelationships {
  object_id: Generated<number>;
  term_order: Generated<number>;
  term_taxonomy_id: Generated<number>;
}

export interface WpTerms {
  name: Generated<string>;
  slug: Generated<string>;
  term_group: Generated<number>;
  term_id: Generated<number>;
}

export interface WpTermTaxonomy {
  count: Generated<number>;
  description: string;
  parent: Generated<number>;
  taxonomy: Generated<string>;
  term_id: Generated<number>;
  term_taxonomy_id: Generated<number>;
}

export interface WpUsermeta {
  meta_key: string | null;
  meta_value: string | null;
  umeta_id: Generated<number>;
  user_id: Generated<number>;
}

export interface WpUsers {
  display_name: Generated<string>;
  ID: Generated<number>;
  user_activation_key: Generated<string>;
  user_email: Generated<string>;
  user_login: Generated<string>;
  user_nicename: Generated<string>;
  user_pass: Generated<string>;
  user_registered: Generated<Date>;
  user_status: Generated<number>;
  user_url: Generated<string>;
}

export interface DB {
  wp_commentmeta: WpCommentmeta;
  wp_comments: WpComments;
  wp_links: WpLinks;
  wp_options: WpOptions;
  wp_postmeta: WpPostmeta;
  wp_posts: WpPosts;
  wp_term_relationships: WpTermRelationships;
  wp_term_taxonomy: WpTermTaxonomy;
  wp_termmeta: WpTermmeta;
  wp_terms: WpTerms;
  wp_usermeta: WpUsermeta;
  wp_users: WpUsers;
}
