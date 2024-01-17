import { Request, Response } from "express"

export const getOrdersByUserId = async (req : Request,res : Response)=>{
    try{

    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}