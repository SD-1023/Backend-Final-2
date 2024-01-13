"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidator = exports.idValidator = void 0;
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
