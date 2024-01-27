import { ProductsModel } from './../models/products';
import { OrdersItemsModel } from './../models/ordersItems';
import { Transaction } from 'sequelize';
import { sequelize } from './../config/database';
import { CartsModel } from './../models/cart';
import { AddressModel } from './../models/address';
import { OrdersModel } from '../models/orders';
import { Request, Response } from "express"
import { UsersModel } from '../models/users';

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
                    attributes:["id","username","email"],
                    
                },
                {
                    model:OrdersItemsModel,
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

export const getAllCancelledOrdersByUserId = async (req: Request, res: Response) =>{
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const cancelledOrders = await OrdersModel.findAll({
            include:{
                model:OrdersItemsModel,
            },
            where:{
                user_Id:id,
                status:'cancelled',
            }
        })

        return res.status(200).json({message:"success",orders:cancelledOrders});
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}

export const getAllCompletedOrdersByUserId = async (req: Request, res: Response) =>{
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const completedOrders = await OrdersModel.findAll({
            include:{
                model:OrdersItemsModel,
            },
            where:{
                user_Id:id,
                status:'delivered',
            }
        })

        return res.status(200).json({message:"success",orders:completedOrders});
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}

export const getAllPendingOrdersByUserId = async (req: Request, res: Response) =>{
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const completedOrders = await OrdersModel.findAll({
            include:{
                model:OrdersItemsModel,
            },
            where:{
                user_Id:id,
                status:'pending',
            }
        })


        return res.status(200).json({message:"success",orders:completedOrders});
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}

export const addOrder = async(req: Request,res: Response)=>{
    let transactionPasser : any;
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }
        
        const cartItems : any = await CartsModel.findAll({
            where:{
                user_id:id
            }
        })

        let createTransaction : Transaction = await sequelize.transaction();
        transactionPasser = createTransaction;
        
        // let productArr : any = [];
        // let productInCartArr : any = [];
        // for(let i = 0;i < cartItems.length;i++){
        //     // this ensures that in productArr[0] is the same the product in cart of productInCartArr[0] and so on.
        //     const product = await ProductsModel.findByPk(cartItems[i].product_id);
        //     const cartItemWithSameId = cartItems.find((prod : any)=> prod.product_id == cartItems[i].product_id);
            
        //     productArr.push(product);
        //     productInCartArr.push(cartItemWithSameId);
        //     if(cartItemWithSameId.dataValues.quantity > product?.dataValues.quantity){
        //         return res.status(400).json({error:`There is no such quantity available for product name : ${product?.dataValues.name}`});
        //     }
        // }

        // let createTransaction : Transaction = await sequelize.transaction();
        // transactionPasser = createTransaction;

        // // ! Ask about locks here, as they not applying
        // for(let i =0;i < productArr.length; i++){
        //     const updatingQuantities = await ProductsModel.update({
        //         quantity:productArr[i].dataValues.quantity - productInCartArr[i].dataValues.unit_quantity
                
        //     },{
        //         where:{
        //             id:productArr[i]?.dataValues.id
                    
        //         },transaction:createTransaction
        //     })
        // }
        // * The Update code still under testing.

        const userAddress = await AddressModel.findOne({
            where:{
                user_id:id
            }
        })
        const ordersList : any = [];
    
            const newOrder = await OrdersModel.create({
                user_id:id,
                city:userAddress?.dataValues.city,
                street:userAddress?.dataValues.street,
                country:userAddress?.dataValues.country,
                mobile_number:userAddress?.dataValues.mobile_number,

            },{ transaction : createTransaction });
            
            for(let i = 0 ; i < cartItems.length - 1 ; i++){
                const newOrderItems = await OrdersItemsModel.create({
                    order_Id:newOrder.dataValues.id,
                    product_id:cartItems[i].dataValues.product_id,
                    unit_price:Number(cartItems[i].dataValues.product_price),
                    unit_quantity:cartItems[i].dataValues.quantity,
                    discount:10,
                    deliveryFee:0,

            },{ transaction : createTransaction });

            await ordersList.push(newOrderItems);
        }

        newOrder.dataValues.ordersItems = [...ordersList];

        await createTransaction.commit();
        return res.status(201).json({message:"success",order:newOrder});
    }catch(error){
        await transactionPasser.rollback();
        console.log(error);
        return res.status(500).json({error});
    }
}

export const cancelOrder = async(req: Request,res: Response)=>{
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const order = await OrdersModel.findByPk(id);
        if(order?.dataValues.status == "delivered"){
            return res.status(400).json({error:"This order was already fulfilled"});
        }

        const cancelAllOrdersForUser = await OrdersModel.update({
            status:"cancelled",
        },
        {
            where: {
                user_id:id,
            }
        })

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
