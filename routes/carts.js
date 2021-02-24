const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');
const router = express.Router();

// receive a post request to add items to cart
router.post('/cart/products', async (req, res) => {
    // figure out the cart
    let cart;
    if(!req.session.cartId){
      // we don't have a cart, we need to create one
      // and store cart id on req.session.cartId property
    
      cart = cartsRepo.create({ items: [] });
      req.session.cartId = cart.id;
      
    }else{
      //we have a cart, lets get it from reposoitory
      cart = await cartsRepo.getOne(req.session.cartId);
    
  }

    const existingItem = cart.items.find(item => item.id === req.body.productId);
    if(!existingItem){
    // Either increment the quantity for existing product
    existingItem.quantity++;
    } else{
    // OR add new product for items array
    cartsRepo.items.push({ id: req.body.productId,  quantity: 1});
    
  }

    await cartsRepo.update(cart.id, {
      items: cart.items
    });


  res.send('Product added to cart');
  });

// receive a GET request to show all items in a cart
router.get('./cart', async (req, res) => {
  if(!req.session.cartId){
    return res.redirect('/');
  }
  const cart = await cartsRepo.getOne(req.session.cartId);

  for(let item of cart.items){
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  }
  res.send(cartShowTemplate({ items: cart.items }));
});
// receive a post request to delete item from cart

module.exports = router;