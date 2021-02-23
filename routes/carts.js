const express = require('express');
const cartsRepo = require('../repositories/carts');

const router = express.Router();

// receive a post request to add items to cart
router.post('/cart/products', async (req, res) => {
    // figure out the cart
    let cart;
    if(!req.session.cartId){
      // we don't have a cart, we need to create one
      // and store cart id on req.session.cartId property
      cart = await cartsRepo.create({ items: [] });
      req.session.cartId = cart.id;
    } else {
      //we have a cart, lets get it from reposoitory
      cart = await cartsRepo.getOne(req.session.cartId);
    }
    console.log(cart);
    // Either increment the quantity for existing product
    // OR add new product for items array

  res.send('Product added to cart');
});
// receive a GET request to show all items in a cart

// receive a post request to delete item from cart

module.exports = router;