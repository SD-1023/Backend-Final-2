// brandsController.ts
import { Request, Response } from 'express';
import { BrandsModel } from '../models/brands';


export const getALLBrands = async (req:Request , res:Response) =>{
    try {
       
        const Brands = await BrandsModel.findAll();
        return res.status(200).json( Brands)
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
        
}

