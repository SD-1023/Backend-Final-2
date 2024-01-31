import { Request, Response } from "express";
import { CartsModel } from "../models/cart";
import { ProductsModel } from "../models/products";
import {
  addToCartSchema,
  cartItemSchema,
} from "../validators/validations";

export const getCartByUserId = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const cart = await CartsModel.findAll({
      attributes: { exclude: ["id"] },
      where: { user_id: userId },
    });

    return res.status(200).json({ message: "success", cartItems: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, quantity, productId } = req.body;
    const { error } = addToCartSchema.validate(req.body);

    if (error) {
      return res.sendStatus(400);
    }

    let cart = await CartsModel.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (cart) {
      return res.status(400).json({ error: "Item already exist in cart" });
    }
    const product = await ProductsModel.findOne({ where: { id: productId } });

    if (!product) {
      return res
        .status(400)
        .json({ error: "Product not found for the specified product ID" });
    }

    let createdCart = await CartsModel.create({
      user_id: userId,
      product_id: productId,
      product_name: product.dataValues.name,
      finalPrice: Number(product.dataValues.finalPrice),
      quantity,
      offer:product.dataValues.offer,
      product_price: Number(product.dataValues.price),
      image_secure_url: product.dataValues.image_secure_url,
    });

    return res.status(200).json({ message: "success", cart: createdCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFromCart = async (req: Request, res: Response) => {
  try {
    const { error } = cartItemSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { userId, productId } = req.body;

    const cart = await CartsModel.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!cart) {
      return res
        .status(400)
        .json({ error: "Product not found in the user's cart" });
    }

    let deleteCartItem: any = await CartsModel.destroy({
      where: { user_id: userId, product_id: productId },
    });

    if (deleteCartItem[0] == 0) {
      return res.status(400).json({ message: "Failed deleting process" });
    }

    return res.status(200).json({ message: "success", productId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    let deleteCartItems: any = await CartsModel.destroy({
      where: { user_id: userId },
    });

    if (deleteCartItems[0] == 0) {
      return res
        .status(400)
        .json({ error: "no cart items were found to delete" });
    }

    return res.status(200).json({ message: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const decreaseQuantity = async (req: Request, res: Response) => {
  try {
    const cartItem = req.body;
    const { productId, userId } = cartItem;

    const { error } = cartItemSchema.validate(req.body);
    if (error) {
      return res.sendStatus(400);
    }

    const cart = await CartsModel.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!cart) {
      return res
        .status(400)
        .json({ error: "Product not found in the user's cart" });
    }

    const currentQuantity = cart.get("quantity") as number;
    if (currentQuantity <= 1) {
      return res
        .status(400)
        .json({ error: "Product quantity cannot be decreased below 1" });
    }

    let updatingCart: any = await cart.update({
      quantity: currentQuantity - 1,
    });

    if (updatingCart[0] == 0) {
      return res.status(400).json({ error: "cart was not updated" });
    }

    return res.status(200).json({ message: "success", updatedCartItem: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const increaseQuantity = async (req: Request, res: Response) => {
  try {
    const cartItem = req.body;
    const { productId, userId } = cartItem;

    const { error } = cartItemSchema.validate(req.body);
    if (error) {
      return res.sendStatus(400);
    }

    const cart = await CartsModel.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!cart) {
      return res
        .status(400)
        .json({ error: "Product not found in the user's cart" });
    }

    const currentQuantity = cart.get("quantity") as number;
    let updatingCart: any = await cart.update({
      quantity: currentQuantity + 1,
    });
    if (updatingCart[0] == 0) {
      return res.status(400).json({ error: "cart was not updated" });
    }

    return res.status(200).json({ message: "success", updatedCartItem: cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
