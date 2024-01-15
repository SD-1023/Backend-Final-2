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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fillingTablesOrders = exports.fillingTablesUsers = exports.fillTablesCategories = exports.fillTablesReviews = exports.fillTables = void 0;
const faker_1 = require("@faker-js/faker");
const products_1 = require("../models/products");
const reviews_1 = require("../models/reviews");
const categories_1 = require("../models/categories");
const users_1 = require("../models/users");
const orders_1 = require("../models/orders");
const generateRandomData = () => {
    const randomProducts = () => ({
        name: faker_1.faker.commerce.productName(),
        price: faker_1.faker.commerce.price({ min: 10.0, max: 300.0 }),
        newArrivals: false,
        description: faker_1.faker.commerce.productDescription(),
        quantity: faker_1.faker.number.int({ min: 0, max: 10 }),
        discount: true,
        finalPrice: faker_1.faker.commerce.price({ max: 150 }),
        category: faker_1.faker.commerce.productMaterial(),
    });
    const randomReviews = () => ({
        user_id: faker_1.faker.number.int({ min: 1, max: 150 }),
        rating: faker_1.faker.number.float({ min: 1, max: 5 }),
        comment: faker_1.faker.lorem.words({ min: 5, max: 15 }),
        product_id: faker_1.faker.number.int({ min: 1, max: 150 }),
    });
    const randomCategories = () => ({
        name: faker_1.faker.commerce.department(),
        image_secure_url: faker_1.faker.image.url(),
    });
    const randomUsers = () => ({
        username: faker_1.faker.internet.userName(),
        email: faker_1.faker.internet.email(),
        password: faker_1.faker.internet.password({ length: 12 }),
    });
    const randomOrders = () => ({
        user_id: faker_1.faker.number.int({ min: 1, max: 100 }),
        product_id: faker_1.faker.number.int({ min: 1, max: 100 }),
        discount: faker_1.faker.number.int({ min: 1, max: 150 }),
        rating: faker_1.faker.number.float({ min: 0, max: 5, precision: 2 }),
        deliveryFee: faker_1.faker.number.float({ min: 0, max: 15, precision: 2 }),
        subTotal: faker_1.faker.number.float({ min: 200, max: 600, precision: 2 }),
        status: faker_1.faker.helpers.arrayElement(["pending", "delivered", "cancelled"]),
        grandTotal: faker_1.faker.number.float({ min: 400, max: 700, precision: 2 }),
    });
    return {
        randomProducts,
        randomReviews,
        randomCategories,
        randomUsers,
        randomOrders,
    };
};
const fillTables = () => __awaiter(void 0, void 0, void 0, function* () {
    const { randomProducts } = generateRandomData();
    for (let i = 0; i < 100; i++) {
        const randomProduct = randomProducts();
        yield products_1.ProductsModel.create(randomProduct);
        console.log(`ITERATION ==========> ${i} <================`);
    }
    console.log(`Products were created successfully`);
});
exports.fillTables = fillTables;
const fillTablesReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const { randomReviews } = generateRandomData();
    for (let i = 0; i < 100; i++) {
        const randomReview = randomReviews();
        yield reviews_1.ReviewsModel.create(randomReview);
        console.log(`ITERATION ==========> ${i} <================`);
    }
});
exports.fillTablesReviews = fillTablesReviews;
const fillTablesCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const { randomCategories } = generateRandomData();
    for (let i = 0; i < 10; i++) {
        const randomCategory = randomCategories();
        yield categories_1.CategoriesModel.create(randomCategory);
        console.log(`ITERATION ==========> ${i} <================`);
    }
});
exports.fillTablesCategories = fillTablesCategories;
const fillingTablesUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const { randomUsers } = generateRandomData();
    for (let i = 0; i < 100; i++) {
        const randomUser = randomUsers();
        yield users_1.UsersModel.create(randomUser);
        console.log(`ITERATION ==========> ${i} <================`);
    }
});
exports.fillingTablesUsers = fillingTablesUsers;
const fillingTablesOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const { randomOrders } = generateRandomData();
    for (let i = 0; i < 100; i++) {
        const randomOrder = randomOrders();
        yield orders_1.OrdersModel.create(randomOrder);
        console.log(`ITERATION ==========> ${i} <================`);
    }
});
exports.fillingTablesOrders = fillingTablesOrders;
