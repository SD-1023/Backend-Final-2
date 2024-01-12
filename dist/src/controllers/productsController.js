"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const products_1 = require("../models/products");
const sequelize_1 = require("sequelize");
const validations_1 = require("../validators/validations");
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // In this project it will be 9
    const products = yield products_1.ProductsModel.findAll({
        where: {
            id: {
                [sequelize_1.Op.gte]: page * limit - limit + 1,
            },
        },
        order: [["id", "ASC"]],
        limit: Number(limit),
    });
    return res.status(200).json({ data: { message: "success", products } });
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { error } = validations_1.idValidator.validate({ id });
    if (error) {
        return res.status(400).json({ validationError: error.message });
    }
    const product = yield products_1.ProductsModel.findByPk(id);
    return res.status(200).json({ product });
});
exports.getProductById = getProductById;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = req.body;
    const { error, value: validatedNewProduct } = validations_1.productValidator.validate(newProduct);
    if (error) {
        return res.status(400).json({ error });
    }
    const image = `data:image/png;base64,${validatedNewProduct.product_image}`;
    let image_secureUrl;
    try {
        yield cloudinary_1.v2.uploader
            .upload(image, {
            folder: process.env.PRODUCTS_IMAGES_FOLDER_PATH,
            use_filename: true,
            resource_type: "image",
            transformation: [{ width: 200, height: 200, crop: "fit" }],
        })
            .then((result) => {
            console.log(result);
            image_secureUrl = result.secure_url;
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
    validatedNewProduct.image_secure_url = image_secureUrl;
    validatedNewProduct.product_image = undefined;
    // removing base64 from returned response
    const insertNewProductToDB = yield products_1.ProductsModel.create({
        name: validatedNewProduct.name,
        category: validatedNewProduct.category,
        price: validatedNewProduct.price,
        description: validatedNewProduct.description,
        finalPrice: validatedNewProduct.finalPrice,
        newArrivals: validatedNewProduct.newArrivals,
        discount: validatedNewProduct.discount,
        quantity: validatedNewProduct.quantity,
        image_secure_url: validatedNewProduct.image_secure_url,
    });
    return res.status(201).json({
        data: {
            message: "success",
            product: validatedNewProduct,
        },
    });
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newProduct = req.body;
    const id = Number(req.params.id);
    const { error: errorProduct, value: validatedNewProduct } = validations_1.productValidator.validate(newProduct);
    if (errorProduct) {
        return res.status(400).json({ errorProduct });
    }
    const { error: idError } = validations_1.idValidator.validate({ id });
    if (idError) {
        return res.status(400).json({ idError });
    }
    const updateNewProductInDB = yield products_1.ProductsModel.update({
        name: validatedNewProduct.name,
        category: validatedNewProduct.category,
        price: validatedNewProduct.price,
        description: validatedNewProduct.description,
        finalPrice: validatedNewProduct.finalPrice,
        newArrivals: validatedNewProduct.newArrivals,
        discount: validatedNewProduct.discount,
        quantity: validatedNewProduct.quantity,
    }, {
        where: {
            id: id,
        },
    });
    return res.status(201).json({
        data: { message: "success", newProduct: validatedNewProduct },
    });
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const { error: idError } = validations_1.idValidator.validate({ id });
    if (idError) {
        return res.status(400).json({ idError });
    }
    const deleteProduct = yield products_1.ProductsModel.destroy({
        where: {
            id: id,
        },
    });
    if (deleteProduct) {
        return res.status(202).json({ data: { message: "success" } });
    }
    else {
        return res.sendStatus(204);
    }
});
exports.deleteProduct = deleteProduct;
