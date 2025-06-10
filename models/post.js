const db = require('../util/database');

module.exports = class Post {
  static create(title, content, userId) {
    return db.execute(
      'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
      [title, content, userId]
    );
  }

  static getByUserId(userId) {
    return db.execute(
      'SELECT * FROM posts WHERE user_id = ?',
      [userId]
    );
  }
};
