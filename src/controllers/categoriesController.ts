import { Request, Response } from "express";
import { CategoriesModel } from "../models/categories";

export const getAllCategories = async (req:Request , res:Response) =>{
    const categories = await CategoriesModel.findAll();

    return res.status(200).json({ data: { message:"success" , categories} })
}