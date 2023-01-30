const db = require('../db');
const pgp = require('pg-promise')({ capSQL: true });
const OrderItem = require('./orderItemModel');

module.exports = class OrderModel {

  async create(data) {
    try {
      const statement = pgp.helpers.insert(data, null, 'order_details') + ' RETURNING *';

      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  async update(id, data) {
    try {
      const condition = pgp.as.format('WHERE id = ${id} RETURNING *', { id: id });
      const statement = pgp.helpers.update(data, null, 'order_details') + condition;
  
      const result = await db.query(statement);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  async findByUser(userId) {
    try {
      const statement = `SELECT *
                         FROM order_details
                         WHERE user_id = $1`;
      const values = [userId];
  
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  async findById(orderId) {
    try {
      const statement = `SELECT *
                         FROM order_details
                         WHERE id = $1`;
      const values = [orderId];
  
      const result = await db.query(statement, values);

      if (result.rows?.length) {
        return result.rows[0];
      }

      return null;

    } catch(err) {
      throw new Error(err);
    }
  }

  async findAll() {
    try {
      const statement = `SELECT *
                         FROM order_details`;
      const values = [userId];
  
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