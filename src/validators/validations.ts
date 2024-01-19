import Joi from "joi";

export const productValidator = Joi.object({
  name: Joi.string().min(4).max(40).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid(
    "Skincare",
    "Handbags",
    "Jewellery",
    "Watches",
    "Eyewear"
  ),
  categoryId: Joi.number().integer().positive().required(),
  description: Joi.string().min(5).max(256).required(),
  finalPrice: Joi.number().max(Joi.ref("price")).default(Joi.ref("price")),
  newArrivals: Joi.boolean().default(false),
  discount: Joi.boolean().default(false),
  quantity: Joi.number().min(0).default(1),
});

// Define the Joi schema based on the AddressModel structure
export const addresssSchema = Joi.object({
  street: Joi.string().max(128).required(),
  city: Joi.string().max(64).required(),
  state: Joi.string().max(64).required(),
  postal_code: Joi.string().max(20).required(),
  country: Joi.string().max(64).required(),
  user_id: Joi.number().integer().required(), // Ensure this matches the datatype of your user id in the database
});

// Define the Joi schema based on the CartModel structure
export const cartsSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  status: Joi.string().valid("active", "completed", "abandoned").required(),
  // Add any other fields you want to validate here
});

// Define the Joi schema based on the OrderModel structure
export const ordersSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  total: Joi.number().precision(2).required(), // Ensure this aligns with your DECIMAL(10, 2) definition
  status: Joi.string().valid("pending", "completed", "cancelled").required(),
  // Add any other fields you want to validate here
});

// Define the Joi schema based on the Rating_ReviewModel structure
export const ratingReviewsSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  product_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(1).required(), // Comment must be a non-empty string
  // Add any other fields you want to validate here
});

// Define the Joi schema based on the UserModel structure
export const usersSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).max(100).required(),
  // Add any other fields you want to validate here
});

export const wishListSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
});
