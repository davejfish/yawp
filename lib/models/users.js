const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  #passwordHash;
  email;

  constructor({ id, username, password_hash, email, reviews }) {
    this.id = id;
    this.username = username;
    this.#passwordHash = password_hash;
    this.email = email;
    if (reviews) this.reviews = reviews.length > 0 ? reviews : [];
  }

  static async insert({
    username,
    passwordHash,
    email,
  }) {
    const { rows } = await pool.query(`
      INSERT INTO users
      (username, password_hash, email)
      VALUES ($1, $2, $3)
      RETURNING *`, [username, passwordHash, email]);
    return new User(rows[0]);
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(`
      SELECT * FROM users
      WHERE email = $1`, [email]);
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
      SELECT * FROM users
    `);
    return rows.map(row => new User(row));
  }

  static async getByID(id) {
    const { rows } = await pool.query(`
      SELECT users.*,
      COALESCE(
        json_agg(json_build_object('stars', rest_reviews.stars, 'review', rest_reviews.review))
        FILTER (WHERE rest_reviews IS NOT NULL), '[]'
      ) AS reviews
      FROM users
      JOIN rest_reviews ON users.id = rest_reviews.user_id
      WHERE users.id = $1
      GROUP BY users.id
    `, [id]);
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }

};
