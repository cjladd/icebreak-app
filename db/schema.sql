-- vibe — MySQL schema
-- Run:  mysql -u root -p < db/schema.sql

DROP DATABASE IF EXISTS vibe;
CREATE DATABASE vibe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vibe;

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(191) NOT NULL UNIQUE,
  handle        VARCHAR(32)  NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(64)  DEFAULT NULL,
  bio           TEXT         DEFAULT NULL,
  avatar_url    VARCHAR(500) DEFAULT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT          DEFAULT NULL,
  mode          ENUM('friendly','romantic','party') NOT NULL,
  title         VARCHAR(280) NOT NULL,
  body          TEXT         DEFAULT NULL,
  category_tag  VARCHAR(48)  DEFAULT NULL,
  is_anonymous  TINYINT(1)   NOT NULL DEFAULT 0,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_posts_mode_created (mode, created_at DESC)
);

CREATE TABLE likes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  post_id    INT NOT NULL,
  user_id    INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_like (post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  post_id           INT NOT NULL,
  user_id           INT DEFAULT NULL,
  parent_comment_id INT DEFAULT NULL,
  body              TEXT NOT NULL,
  is_anonymous      TINYINT(1) NOT NULL DEFAULT 0,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_comments_post (post_id, created_at)
);
