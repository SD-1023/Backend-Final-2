import { ProductsModel } from './../models/products';
import { OrdersItemsModel } from './../models/ordersItems';
import { Sequelize, Transaction } from 'sequelize';
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
        
        if(cartItems.length == 0 ){
            return res.status(400).json({error:"You cant order an empty cart"});
        }

        let createTransaction : Transaction = await sequelize.transaction();
        transactionPasser = createTransaction;

        let productArr : any = [];
        let productInCartArr : any = [];
        for(let i = 0;i < cartItems.length;i++){
            // this ensures that in productArr[0] is the same the product in cart of productInCartArr[0] and so on.
            const product = await ProductsModel.findByPk(cartItems[i].product_id,{lock:true});
            const cartItemWithSameId = cartItems.find((prod : any)=> prod.product_id == cartItems[i].product_id);

            productArr.push(product);
            productInCartArr.push(cartItemWithSameId);
            
            if(cartItemWithSameId.dataValues.quantity > product?.dataValues.quantity){
                return res.status(400).json({error:`There is no such quantity available for product name : ${product?.dataValues.name}`});
            }
        }

        
        for(let i =0;i < productArr.length; i++){
            const updatingQuantities = await ProductsModel.update({
                quantity:productArr[i].dataValues.quantity - productInCartArr[i].dataValues.quantity
                
            },{
                where:{
                    id:productArr[i]?.dataValues.id
                    
                },transaction:createTransaction
            })

            if(updatingQuantities[0] == 0){
                await createTransaction.rollback();
                return res.status(400).json({error:"Some products were not updated"});
            }
        }
        

        const userAddress = await AddressModel.findOne({
            where:{
                user_id:id
            }
        })
        if(userAddress == null){
            await createTransaction.rollback();
            return res.status(400).json({error:"user cant send order without an address"});
        }

        const ordersList : any = [];
    
            const newOrder = await OrdersModel.create({
                user_id:id,
                city:userAddress?.dataValues.city,
                street:userAddress?.dataValues.street,
                country:userAddress?.dataValues.country,
                mobile_number:userAddress?.dataValues.mobile_number,

            },{ transaction : createTransaction });
            
            
            for(let j = 0 ; j < cartItems.length ; j++){
                const newOrderItems = await OrdersItemsModel.create({
                    order_Id:newOrder.dataValues.id,
                    product_id:cartItems[j].dataValues.product_id,
                    unit_price:Number(cartItems[j].dataValues.finalPrice),
                    unit_quantity:cartItems[j].dataValues.quantity,
                    discount:10,
                    deliveryFee:0,

                },{ transaction : createTransaction });

                ordersList.push(newOrderItems);
            }

            const deleteCartItems = await CartsModel.destroy({
                where:{
                    user_id:id

                },transaction:createTransaction
            })

            if(deleteCartItems != cartItems.length){
                await createTransaction.rollback();
                return res.status(400).json({error:"Cart items were not all deleted, process terminated"});
            }

            if(ordersList.length == 0 ){
                await createTransaction.rollback();
                return res.status(400).json({error:"Order items were not created"});
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
    let transactionPasser : any;
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const order = await OrdersModel.findByPk(id);
        if(order?.dataValues.status == "delivered"){
            return res.status(400).json({error:"This order was already fulfilled"});
        }
        if(order == null){
            return res.status(400).json({error:"order was not found"})
        }
        let updatingQuantitiesTransaction : Transaction = await sequelize.transaction();
        transactionPasser = updatingQuantitiesTransaction;

        const cancelAllOrdersForUser = await OrdersModel.update({
            status:"cancelled",
        },
        {
            where: {
                id:id,
            },transaction:updatingQuantitiesTransaction,
        })

        if(cancelAllOrdersForUser[0] == 0){
            console.log("Items were not found");
            return res.sendStatus(204);
        }

        let orderItems = await OrdersItemsModel.findAll({
            where:{
                order_Id:id,
            }
        })
        console.log(orderItems,"orderITems");

        for(let i=0;i<orderItems.length ; i++){
            let restoringProductQuantity = await ProductsModel.update({
                quantity:Sequelize.literal(`quantity + ${orderItems[i].dataValues.unit_quantity}`),
            },{
                where:{
                    id:orderItems[i].dataValues.product_id
                }
            })

            if(restoringProductQuantity[0] == 0){
                await updatingQuantitiesTransaction.rollback();
                return res.status(400).json({error:"Product was not updated"})
            }
        }

        return res.status(400).json({message:"success"});

    }catch(error){
        await transactionPasser?.rollback();
        console.log(error);
        return res.status(500).json({error})
    }
}
