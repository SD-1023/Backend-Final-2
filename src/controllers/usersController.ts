import { UsersModel } from './../models/users';
import { Request, Response } from "express";
import { Op } from "sequelize";

export const getAllUsers = async (req:Request ,res: Response )=>{
    try{
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 9;
            
        if (page < 0) {
          page = 1;
        }
        if (limit > 160 || limit < 0) {
          limit = 9;
        }
    
        const search = req.query.search?.toString();
        let conditions: any = {};
    
        if (search) {
          conditions.username = {
            [Op.like]: `%${req.query.search}%`,
          };
        }

        const allUsers = await UsersModel.findAll({
            where: conditions,
            order:[["id", "ASC"]],
            limit: Number(limit),
            offset: (page - 1) * limit,
        });

        return res.status(200).json({data : { message : "success" , users:allUsers}})
    }catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
}

export const getUserById = async (req: Request,res: Response) =>{
    try{
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
          return res.sendStatus(400);
        }
        const userProfile = await UsersModel.findByPk(id);
        
        return res.status(200).json({data: { message:"success", user:userProfile}})
    }catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
}