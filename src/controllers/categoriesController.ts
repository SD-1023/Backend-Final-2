import { ProductsModel } from './../models/products';
import { Request, Response } from "express";
import { CategoriesModel } from "../models/categories";

export const getAllCategories = async (req:Request , res:Response) =>{
    try{
        const categories = await CategoriesModel.findAll();
        const returnedCount = categories.length;

        return res.status(200).json({message:"success", count:returnedCount , categories})
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
    
}

export const getOneCategoryById = async (req:Request,res:Response) =>{
    try {
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }
        let limit = Number(req.query.limit) || 9;

        if (limit > 80 || limit < 0) {
          limit = 9;
        }

        const category = await CategoriesModel.findByPk(id,{
            include:{
                model:ProductsModel,
                as:"products",
                limit:Number(limit),
                order:[['id','ASC']]
            },
        })
        const count = category?.dataValues.products.length;

        return res.status(200).json({message:"success",count, category })
    }catch(error){
        console.log(error);
        return res.sendStatus(500);
    }
}