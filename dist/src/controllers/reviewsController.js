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
exports.getAllReviewsById = void 0;
const reviews_1 = require("../models/reviews");
const getAllReviewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 20;
    let id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.sendStatus(400);
    }
    if (page < 0) {
        page = 1;
    }
    if (limit > 80 || limit < 0) {
        limit = 20;
    }
    let conditions = {
        product_id: id,
    };
    const reviews = yield reviews_1.ReviewsModel.findAll({
        where: conditions,
        order: [["id", "DESC"]],
        limit: Number(limit),
        offset: (page - 1) * limit,
    });
    const count = yield reviews_1.ReviewsModel.count({ where: conditions });
    return res
        .status(200)
        .json({ data: { message: "success", count, page, limit, reviews } });
});
exports.getAllReviewsById = getAllReviewsById;
