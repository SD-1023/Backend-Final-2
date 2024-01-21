import { Request, Response } from "express"
import { CartsModel } from "../models/cart";
import { ProductsModel } from "../models/products";

export const getCartByUserId = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
  
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      const carts = await CartsModel.findAll({ where: { user_id: userId } });
  
      if (!carts || carts.length === 0) {
        return res.status(404).json({ error: 'No cart entries found for the specified user ID' });
      }
        const cartItems = [];
      for (const cart of carts) {
        const productId: string = cart.get('product_id') as string;
        const product = await ProductsModel.findOne({ where: { id: productId } });
  
        if (!product) {
          cartItems.push({
            ...cart.get(),
            error: 'Product not found for the specified product ID',
          });
        } else {
          const productDescription: string = product.get('description') as string;
          const productImageSecureUrl: string = product.get('image_secure_url') as string;
          const finalPrice: number = parseFloat(product.get('finalPrice') as string);
  
          cartItems.push({
            ...cart.get(),
            finalPrice,
            productDescription,
            productImageSecureUrl,
          });
        }
      }
  
      return res.status(200).json({ message: 'Success', cartItems });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
  


  export const addToCart = async (req: Request, res: Response) => {
    try {
      const { userId, quantity, product_id } = req.body;
  
      if (!userId || !quantity || !product_id) {
        return res.status(400).json({ error: 'Invalid request data' });
      }
        let cart = await CartsModel.findOne({ where: { user_id: userId, product_id } });
  
      if (cart) {
        const currentQuantity: number = cart.get('quantity') as number;
  
        if (quantity >= currentQuantity) {
          await cart.update({ quantity });
        }
      } else {
        const product = await ProductsModel.findOne({ where: { id: product_id } });
  
        if (!product) {
          return res.status(404).json({ error: 'Product not found for the specified product ID' });
        }
  
        const product_name: string = product.get('name') as string;
        const finalPrice: number = parseFloat(product.get('finalPrice') as string);
  
        cart = await CartsModel.create({
          user_id: userId,
          product_id,
          product_name,
          finalPrice,
          quantity,
        });
      }
  
      return res.status(200).json({ message: 'Success', cart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  export const deleteFromCart = async (req: Request, res: Response) => {
    try {
      const { userId, productId } = req.body;
  
      if (!userId || !productId) {
        return res.status(400).json({ error: 'Both userId and productId are required in the request body' });
      }
  
      const cart = await CartsModel.findOne({
        where: { user_id: userId, product_id: productId },
      });
  
      if (!cart) {
        return res.status(404).json({ error: 'Product not found in the user\'s cart' });
      }
  
      await CartsModel.destroy({
        where: { user_id: userId, product_id: productId },
      });
  
      return res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
  
  export const clearCart = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
  
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
  
      await CartsModel.destroy({
        where: { user_id: userId }, 
      });
  
      return res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  