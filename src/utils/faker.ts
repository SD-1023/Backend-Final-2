import {faker} from "@faker-js/faker";
import { ProductsModel } from "../models/products";

const generateRandomData = ()=>{

    const randomProducts = ()=>({
        name:faker.commerce.productName(),
        price:faker.commerce.price({min:10.00,max:300.00}),
        newArrivals:false,
        description:faker.commerce.productDescription(),
        quantity:faker.number.int({min:0,max:10}),
        discount:true,
        finalPrice:faker.commerce.price({max:150}),
        category:faker.commerce.productMaterial()
    })

    return {
        randomProducts,
    }
}

export const fillTables = async()=>{
    const { randomProducts } = generateRandomData();

    for(let i=0 ; i < 100 ; i++){
        const randomProduct = randomProducts();
        await ProductsModel.create(randomProduct);
        console.log(`ITERATION ==========> ${i} <================`);
    }

    console.log(`Products were created successfully`)
}


