import { reviewsSchema, updateReviewSchema } from './../validators/validations';
import { Request, Response } from "express";
import { ReviewsModel } from "../models/reviews";

export const getAllReviewsByUserId = async (req: Request, res: Response) => {
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

export const addNewReview = async (req :Request ,res:Response)=>{
  try{
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
      return res.sendStatus(400);
    }
    const newComment = req.body;

    const {error ,value} = reviewsSchema.validate(newComment)
    if(error){
      return res.status(400).json({error})
    }

    const newReview = await ReviewsModel.create({
      product_id:id,
      comment:value.comment,
      rating:value.rating,
      user_id:value.userId,
    })

    return res.status(201).json({message:"success",comment:newReview})
  }catch(error){
    console.log(error);
    return res.sendStatus(500);
  }
}

export const editReview = async (req:Request,res:Response) =>{
  try{
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
      return res.sendStatus(400);
    }
    const oldComment = req.body;
    const {error ,value} = updateReviewSchema.validate(oldComment)
    if(error){
      return res.status(400).json({error})
    }
    let values : any = {};
    value.newComment ? values.comment = value.newComment : null;
    value.newRating ? values.rating = value.newRating : null;

    const newReview = await ReviewsModel.update({
      ...values
    },{
      where:{
        id:id
      }
    })
    return res.status(200).json({message:"success",comment:{...values}})

  }catch(error){
    console.log(error);
    return res.sendStatus(500);
  }
}

export const deleteReview = async (req:Request,res:Response) =>{
  try{
    const id = Number(req.params.id);
    if(Number.isNaN(id)){
      return res.sendStatus(400);
    }
    const deletedReview = await ReviewsModel.destroy({
      where:{
        id:id
      },
    })

    if(deletedReview == 1 ){
      return res.status(202).json({message:"success"});
    }else{
      return res.sendStatus(404);
    }
    
  }catch(error){
    console.log(error);
    return res.sendStatus(500);
  }
}