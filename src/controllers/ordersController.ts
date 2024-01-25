import { Transaction } from 'sequelize';
import { sequelize } from './../config/database';
import { CartsModel } from './../models/cart';
import { AddressModel } from './../models/address';
import { ProductsModel } from './../models/products';
import { OrdersModel } from './../models/orders';
import { Request, Response } from "express"
import { UsersModel } from '../models/users';

// This gets order items
export const getOrdersByUserId = async (req : Request,res : Response)=>{
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const orders = await OrdersModel.findAll({
            attributes:{
                exclude:['user_id','updatedAt']
            },
            include:[
                {
                    model:UsersModel,
                    attributes:["id","username","email"]
                }
            ],
            where:{
                user_id:id,
            },
        })
        
        return res.status(200).json({message:"success",orders})
    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

export const addOrder = async(req: Request,res: Response)=>{
    let transactionPasser : any;
    try{
        // user id
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const requestedOrder = req.body;
        // Order validator.
        const cartItems = await CartsModel.findAll({
            where:{
                user_id:id
            }
        })
        
        const userAddress = await AddressModel.findOne({
            where:{
                user_id:id
            }
        })
        //console.log([...cartItems]) 
        //console.log({cartItems,userAddress});
        //console.log(userAddress?.dataValues)
        let createTransaction : Transaction = await sequelize.transaction();
        transactionPasser = createTransaction;
        const ordersList : any = [];
        for(let i = 0 ; i < cartItems.length - 1 ; i++){
            let deliveryFee = 20;
            let discount = 10;
            const newOrder = await OrdersModel.create({
                user_id:id,
                city:userAddress?.dataValues.city,
                street:userAddress?.dataValues.street,
                country:userAddress?.dataValues.country,
                mobile_number:userAddress?.dataValues.mobile_number,
                product_id:cartItems[i].dataValues.product_id,
                discount,
                deliveryFee,
                grandTotal:(cartItems[i].dataValues.product_price * cartItems[i].dataValues.quantity) - deliveryFee - discount,
                subTotal:Number(cartItems[i].dataValues.product_price * cartItems[i].dataValues.quantity),
                unit_price:Number(cartItems[i].dataValues.product_price),
                unit_quantity:cartItems[i].dataValues.quantity,
            },{transaction:createTransaction});

            await ordersList.push(newOrder);
        }

        await createTransaction.commit();
        return res.status(201).json({message:"success",orders:[...ordersList]})
    }catch(error){
        await transactionPasser.rollback();
        console.log(error);
        return res.status(500).json({error})
    }
}

export const cancelOrder = async(req: Request,res: Response)=>{
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const cancelAllOrdersForUser = await OrdersModel.update({
            status:"cancelled",
        },
        {
            where: {
                user_id:id,
            }
        })

        // When try's to delete and find nothing
        if(cancelAllOrdersForUser[0] == 0){
            console.log("Items were not found");

            return res.sendStatus(204);
        }
        return res.status(400).json({message:"success"});

    }catch(error){
        console.log(error);
        return res.status(500).json({error})
    }
}
