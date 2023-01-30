const express = require('express');
const router = express.Router();
const db = require('../db');
const bodyParser = require('body-parser');
const path = require('path');

const YOUR_DOMAIN = "http://localhost:3000";

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.join(__dirname, './views')));
router.use(express.json());

async function checkout(cartId, userId, paymentInfo) {
    try {

      const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

      // Load cart items
      const cartItems = await Cart.findItem(cartId);

      // Generate total price from cart items
      const total = cartItems.reduce((total, item) => {
        return total += Number(item.price);
      }, 0);

      // Generate initial order
      const Order = new OrderModel({ total, userId });
      Order.addItems(cartItems);
      await Order.create();

      // Make charge to payment method (not required in this project)
      const charge = await stripe.charges.create({
        amount: total,
        currency: 'eur',
        source: paymentInfo.id,
        description: 'Super Charge'
      });

      // On successful charge to payment method, update order status to COMPLETE
      const order = Order.update({ status: 'COMPLETE' });

      return order;

    } catch(err) {
      throw err;
    }
  }

router.post('/cart/checkout', async (req, res, next) => {
    try {
        const userId = req.user.id;

        const { cartId, paymentInfo } = req.body; 

        const result = await checkout(cartId, userId, paymentInfo);

        res.status(200).send(result);
    } catch(err) {
        next(err);
        throw err;
    }
});

module.exports = router