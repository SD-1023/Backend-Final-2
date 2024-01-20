import { Request, Response } from "express";
import { ReviewsModel } from "../models/reviews";

export const getAllReviewsById = async (req: Request, res: Response) => {
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
  const reviews = await ReviewsModel.findAll({
    where: conditions,
    order: [["id", "DESC"]],
    limit: Number(limit),
    offset: (page - 1) * limit,
  });

  const count = await ReviewsModel.count({ where: conditions });
  return res
    .status(200)
    .json({message: "success", count, page, limit, reviews });
};
