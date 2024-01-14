"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersSchema = exports.ratingReviewsSchema = exports.ordersSchema = exports.cartsSchema = exports.addresssSchema = exports.productValidator = exports.idValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.idValidator = joi_1.default.object({
    id: joi_1.default.number().required(),
});
exports.productValidator = joi_1.default.object({
    name: joi_1.default.string().min(4).max(40).required(),
    price: joi_1.default.number().min(0).required(),
    category: joi_1.default.string().valid("Personal Care", "Handbags", "Wrist Watches", "Sun Glasses"),
    description: joi_1.default.string().min(5).max(256).required(),
    finalPrice: joi_1.default.number().max(joi_1.default.ref('price')).default(joi_1.default.ref('price')),
    newArrivals: joi_1.default.boolean().default(false),
    discount: joi_1.default.boolean().default(false),
    quantity: joi_1.default.number().min(0).default(1),
    product_image: joi_1.default.string().base64(),
});
// Define the Joi schema based on the AddressModel structure
exports.addresssSchema = joi_1.default.object({
    street: joi_1.default.string().max(128).required(),
    city: joi_1.default.string().max(64).required(),
    state: joi_1.default.string().max(64).required(),
    postal_code: joi_1.default.string().max(20).required(),
    country: joi_1.default.string().max(64).required(),
    user_id: joi_1.default.number().integer().required(), // Ensure this matches the datatype of your user id in the database
});
// Define the Joi schema based on the CartModel structure
exports.cartsSchema = joi_1.default.object({
    user_id: joi_1.default.number().integer().required(),
    status: joi_1.default.string().valid('active', 'completed', 'abandoned').required(),
    // Add any other fields you want to validate here
});
// Define the Joi schema based on the OrderModel structure
exports.ordersSchema = joi_1.default.object({
    user_id: joi_1.default.number().integer().required(),
    total: joi_1.default.number().precision(2).required(), // Ensure this aligns with your DECIMAL(10, 2) definition
    status: joi_1.default.string().valid('pending', 'completed', 'cancelled').required(),
    // Add any other fields you want to validate here
});
// Define the Joi schema based on the Rating_ReviewModel structure
exports.ratingReviewsSchema = joi_1.default.object({
    user_id: joi_1.default.number().integer().required(),
    product_id: joi_1.default.number().integer().required(),
    rating: joi_1.default.number().integer().min(1).max(5).required(),
    comment: joi_1.default.string().min(1).required(), // Comment must be a non-empty string
    // Add any other fields you want to validate here
});
// Define the Joi schema based on the UserModel structure
exports.usersSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(50).required(),
    email: joi_1.default.string().email({ tlds: { allow: false } }).required(),
    password: joi_1.default.string().min(6).max(100).required(),
    // Add any other fields you want to validate here
});
