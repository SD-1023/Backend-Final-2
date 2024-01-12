import Joi from "joi";

export const idValidator = Joi.object({
    id:Joi.number().required(),
})

export const productValidator = Joi.object({
    name:Joi.string().min(4).max(40).required(),
    price:Joi.number().min(0).required(),
    category:Joi.string().valid("Personal Care","Handbags","Wrist Watches","Sun Glasses"),
    description:Joi.string().min(5).max(256).required(),
    finalPrice:Joi.number().max(Joi.ref('price')).default(Joi.ref('price')),
    newArrivals:Joi.boolean().default(false),
    discount:Joi.boolean().default(false),
    quantity:Joi.number().min(0).default(1),
    product_image:Joi.string().base64(),
})