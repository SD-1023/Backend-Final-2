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
    const imagePath = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";
    // * Both image path and base64 works
    let image_secureUrl;
    try {
        yield cloudinary_1.v2.uploader
            .upload(imagePath, {
            folder: process.env.PRODUCTS_IMAGES_FOLDER_PATH,
            resource_type: "image",
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
