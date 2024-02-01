import { ProductsModel } from './../models/products';
import { Request, Response } from "express";
import { WishlistsModel } from "../models/wishlist";
import { wishListSchema } from "../validators/validations";

export const getAllWishlistsByUserId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.sendStatus(400);
    }

    const userWishList = await WishlistsModel.findAll({
      attributes:{
        exclude:["product_id"]
      },
      where: {
        user_id: id,
      },
      include:{
        model:ProductsModel
      }
    });

    return res
      .status(200)
      .json({message: "success", wishlist: userWishList });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const addToWishList = async (req: Request, res: Response) => {
  try {
    const newWishList = req.body;

    const { error } = wishListSchema.validate(newWishList);
    if (error) {
      return res.status(400).json(error);
    }

    // Try to avoid doing this query by forcing it by the associations
    const userWishList = await WishlistsModel.findOne({
      where:{
        product_id:newWishList.productId,
        user_id:newWishList.userId
      }
    })

    if(userWishList){
      return res.status(400).json({error:"Item already exist"});
    }

    const AddNewWishList = await WishlistsModel.create({
      user_id: newWishList.userId,
      product_id: newWishList.productId,
    });
    return res
      .status(201)
      .json({ message: "success", WishList: AddNewWishList });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const deleteFromWishList = async (req : Request,res : Response)=>{
    try{
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
          return res.sendStatus(400);
        }

        const wishListItem = await WishlistsModel.destroy({
            where: {
                id:id
            }
        });
        if(wishListItem){
            return res.status(202).json({message:"success"})
        }
        if(!wishListItem){
            return res.sendStatus(204);
        }

    }catch(error){
        console.log(error)
        return res.status(500).json(error);
    }
};

export const clearWishList = async (req :Request,res: Response)=>{
    try{

        const id = Number(req.params.id);
        
        if (Number.isNaN(id)) {
          return res.sendStatus(400);
        }

        const deletedWishList = await WishlistsModel.destroy({
            where:{
                user_id:id
            }
        })

        if(deletedWishList){
            return res.status(202).json({message:"success"})
        }
        if(!deletedWishList){
            return res.sendStatus(204);
        }

            return res.sendStatus(234)
    }catch(error){

        console.log(error)
        return res.status(500).json({error})
    }
};
