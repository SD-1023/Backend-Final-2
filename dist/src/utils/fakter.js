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
exports.fillTables = void 0;
const faker_1 = require("@faker-js/faker");
const products_1 = require("../models/products");
const generateRandomData = () => {
    const randomProducts = () => ({
        name: faker_1.faker.commerce.productName(),
        price: faker_1.faker.commerce.price({ min: 10.00, max: 300.00 }),
        newArrivals: false,
        description: faker_1.faker.commerce.productDescription(),
        quantity: faker_1.faker.number.int({ min: 0, max: 10 }),
        discount: true,
        finalPrice: faker_1.faker.commerce.price({ max: 150 }),
        category: faker_1.faker.commerce.productMaterial()
    });
    return {
        randomProducts,
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
