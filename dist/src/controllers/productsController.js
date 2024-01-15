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
const fileSystem_1 = require("../config/fileSystem");
const reviews_1 = require("../models/reviews");
const database_1 = require("../config/database");
dotenv_1.default.config();
(0, fileSystem_1.applyFileSysyem)();
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;
    if (page < 0) {
        page = 1;
    }
    if (limit > 80 || limit < 0) {
        limit = 9;
    }
    const search = (_a = req.query.search) === null || _a === void 0 ? void 0 : _a.toString();
    let conditions = {};
    if (search) {
        conditions.name = {
            [sequelize_1.Op.like]: `%${req.query.search}%`,
        };
    }
    let greaterThan;
    if (!Number.isNaN(req.query["gte"])) {
        greaterThan = Number(req.query["gte"]);
    }
    let lessThan;
    if (!Number.isNaN(req.query["lte"])) {
        lessThan = Number(req.query["lte"]);
    }
    if (greaterThan) {
        conditions = Object.assign(Object.assign({}, conditions), { price: {
                [sequelize_1.Op.gte]: greaterThan,
            } });
    }
    if (lessThan) {
        conditions = Object.assign(Object.assign({}, conditions), { price: Object.assign(Object.assign({}, conditions["price"]), { [sequelize_1.Op.lte]: lessThan }) });
    }
    let sort = req.query.sort;
    if (sort &&
        (sort == "-name" || sort == "name" || sort == "price" || sort == "-price")) {
        let dir;
        sort.includes("-") ? (dir = "DESC") : (dir = "ASC");
        sort = [[`${sort.replace("-", "")}`, dir]];
    }
    else {
        sort = [["id", "ASC"]];
    }
    const category = req.query.category;
    if (category &&
        (category == "Steel" ||
            category == "Watches" ||
            category == "Skincare" ||
            category == "Handbags" ||
            category == "Sun Glasses")) {
        conditions = Object.assign(Object.assign({}, conditions), { category: category });
    }
    const products = yield products_1.ProductsModel.findAll({
        where: conditions,
        attributes: {
            include: [
                [database_1.sequelize.fn("AVG", database_1.sequelize.col('rating')), "averageStars"],
                [database_1.sequelize.fn("COUNT", database_1.sequelize.col('rating')), "ratingNumbers"]
            ]
        },
        include: [{
                model: reviews_1.ReviewsModel,
                attributes: []
            }],
        group: ['products.id'],
        subQuery: false,
        order: sort,
        limit: Number(limit),
        offset: (page - 1) * limit,
    });
    const count = yield products_1.ProductsModel.count({ where: conditions });
    return res
        .status(200)
        .json({ data: { message: "success", count, page, limit, products } });
});
exports.getAllProducts = getAllProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.sendStatus(400);
    }
    let product = yield products_1.ProductsModel.findByPk(id, {
        include: [reviews_1.ReviewsModel],
    });
    let [[{ avgRate }]] = yield database_1.sequelize.query(`SELECT AVG(rating) as avgRate FROM reviews WHERE product_id = ${id}`);
    if (Number.isNaN(avgRate)) {
        avgRate = 0;
    }
    return res.status(200).json({ data: { message: "success", product: Object.assign(Object.assign({}, product === null || product === void 0 ? void 0 : product.dataValues), { averageRating: Number(avgRate) }), } });
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
    if (Number.isNaN(id)) {
        return res.sendStatus(400);
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
    if (Number.isNaN(id)) {
        return res.sendStatus(400);
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
