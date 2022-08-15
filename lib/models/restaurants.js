const pool = require('../utils/pool');

module.exports = class Restaurant {
  id;
  name;

  constructor({ id, name, reviews }) {
    this.id = id;
    this.name = name;
    if (reviews) this.reviews = reviews.length > 0 ? reviews : [];
  }

  static async getAll() {
    const { rows } = await pool.query(`
      SELECT * FROM restaurants
    `);
    return rows.map(row => new Restaurant(row));
  }

  static async getByID(id) {
    const { rows } = await pool.query(`
      SELECT restaurants.*,
      COALESCE(
        json_agg(to_jsonb(rest_reviews.review))
        FILTER (WHERE rest_reviews IS NOT NULL), '[]'
      ) AS reviews
      FROM restaurants
      JOIN rest_reviews ON restaurants.id = rest_reviews.rest_id
      JOIN users ON rest_reviews.user_id = users.id
      WHERE restaurants.id = $1
      GROUP BY restaurants.id`, [id]);
    if (!rows) return null;
    return new Restaurant(rows[0]);
  }

};
