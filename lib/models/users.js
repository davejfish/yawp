const pool = require('../utils/pool');

module.exports = class User {
  id;
  username;
  #passwordHash;
  email;

  constructor({ id, username, password_hash, email }) {
    this.id = id;
    this.username = username;
    this.#passwordHash = password_hash;
    this.email = email;
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
    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
      SELECT * FROM users
    `);
    return rows.map(row => new User(row));
  }

  get passwordHash() {
    return this.#passwordHash;
  }

};
