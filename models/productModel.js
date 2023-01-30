const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });

module.exports = class ProductModel {

  async find() {
    try {
      const statement = `SELECT *
                         FROM product`;
  
      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows;
      }

      return [];

    } catch(err) {
      throw err;
    }
  }

  async findByCategory(category) {
    try {
      const statement = `SELECT * FROM product 
                        WHERE category_id = (SELECT id FROM product_category WHERE name = $1)`;
      const values = [category.category];
  
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows;
      }

      return [];

    } catch(err) {
      throw err;
    }
  }

  async findOne(id) {
    try {
      const statement = `SELECT *
                         FROM product
                         WHERE id = $1`;
      const values = [id];
  
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0]
      }
  
      return null;

    } catch(err) {
      throw err;
    }
  }

  async create(data) {
    try {
      const statement = pgp.helpers.insert(data, null, 'users') + 'RETURNING *';
    
      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

} 