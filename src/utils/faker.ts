import { OrdersItemsModel } from "./../models/ordersItems";
import { CartsModel } from "../models/cart";
import { AddressModel } from "../models/address";
import { WishlistsModel } from "../models/wishlist";
import { faker } from "@faker-js/faker";
import { ProductsModel } from "../models/products";
import { ReviewsModel } from "../models/reviews";
import { CategoriesModel } from "../models/categories";
import { UsersModel } from "../models/users";
import { OrdersModel } from "../models/orders";
const generateRandomData = () => {
  const randomProducts = () => ({
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 10.0, max: 300.0 }),
    newArrivals: false,
    description: faker.commerce.productDescription(),
    quantity: faker.number.int({ min: 0, max: 10 }),
    discount: true,
    finalPrice: faker.commerce.price({ min: 0, max: 150 }),
    category: faker.commerce.productMaterial(),
    Category__Id: faker.number.int({ min: 1, max: 5 }),
  });

  const randomReviews = () => ({
    user_id: faker.number.int({ min: 1, max: 150 }),
    rating: faker.number.float({ min: 1, max: 5 }),
    comment: faker.lorem.words({ min: 5, max: 12 }),
    product_id: faker.number.int({ min: 1, max: 150 }),
  });

  const randomCategories = () => ({
    name: faker.commerce.department(),
    image_secure_url: faker.image.url(),
  });

  const randomUsers = () => ({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  });

  const randomOrders = () => ({
    user_id: faker.number.int({ min: 1, max: 100 }),
    discount: faker.number.int({ min: 1, max: 150 }),
    deliveryFee: faker.number.float({ min: 0, max: 15, precision: 2 }),
    street: faker.location.street(),
    status: faker.helpers.arrayElement(["pending", "delivered", "cancelled"]),
    city: faker.location.city(),
    country: faker.location.country(),
    mobile_number: faker.phone.number(),
  });

  const randomOrdersItems = () => ({
    product_id: faker.number.int({ min: 1, max: 100 }),
    rating: faker.number.float({ min: 0, max: 5, precision: 2 }),
    unit_quantity: faker.number.int({ min: 1, max: 20 }),
    unit_price: faker.number.float({ min: 10.0, max: 150.0, precision: 2 }),
    discount: faker.number.float({ min: 0.0, max: 20.0, precision: 2 }),
    order_Id: faker.number.int({ min: 0, max: 100 }),
    deliveryFee: faker.number.int({ min: 0, max: 20 }),
  });

  const randomWishLists = () => ({
    user_id: faker.number.int({ min: 1, max: 50 }),
    product_id: faker.number.int({ min: 1, max: 75 }),
  });

  const randomAddresses = () => ({
    street: faker.location.street(),
    city: faker.location.city(),
    country: faker.location.country(),
    state: faker.location.state(),
    postal_code: faker.finance.pin(),
    country_calling_code: faker.location.countryCode("numeric"),
    mobile_number: faker.phone.number(),
    Full__Name: faker.person.fullName(),
    user_id: faker.number.int({ min: 1, max: 100 }),
  });

  const randomCart = () => ({
    product_id: faker.number.int({ min: 1, max: 100 }),
    product_name: faker.commerce.productName(),
    user_id: faker.number.int({ min: 1, max: 100 }),
    quantity: faker.number.int({ min: 1, max: 10 }),
    product_price: faker.number.float({ min: 10, max: 500, precision: 2 }),
    finalPrice: faker.number.float({ min: 10, max: 500, precision: 2 }),
    image_secure_url: faker.image.urlPicsumPhotos(),
  });

  const randomOrderProduct = () => ({
    order_id: faker.number.int({ min: 1, max: 100 }),
    product_id: faker.number.int({ min: 1, max: 100 }),
  });

  const randomBrands = () => ({
    name: faker.company.name(),
    image_secure_url: faker.image.url(),
  });

  return {
    randomProducts,
    randomReviews,
    randomCategories,
    randomUsers,
    randomOrders,
    randomOrdersItems,
    randomWishLists,
    randomAddresses,
    randomCart,
    randomOrderProduct,
  };
};

export const fillTables = async () => {
  const { randomProducts } = generateRandomData();

  for (let i = 0; i < 150; i++) {
    const randomProduct = randomProducts();
    await ProductsModel.create(randomProduct);
    console.log(`ITERATION ==========> ${i} <================`);
  }

  console.log(`Products were created successfully`);
};

export const fillTablesReviews = async () => {
  const { randomReviews } = generateRandomData();

  for (let i = 0; i < 100; i++) {
    const randomReview = randomReviews();
    await ReviewsModel.create(randomReview);
    console.log(`ITERATION ==========> ${i} <================`);
  }
};

export const fillTablesCategories = async () => {
  const { randomCategories } = generateRandomData();

  for (let i = 0; i < 10; i++) {
    const randomCategory = randomCategories();
    await CategoriesModel.create(randomCategory);
    console.log(`ITERATION ==========> ${i} <================`);
  }
};

export const fillingTablesUsers = async () => {
  const { randomUsers } = generateRandomData();

  for (let i = 0; i < 100; i++) {
    const randomUser = randomUsers();
    await UsersModel.create(randomUser);
    console.log(`ITERATION ==========> ${i} <================`);
  }
};

export const fillingTablesOrders = async () => {
  const { randomOrders } = generateRandomData();

  for (let i = 0; i < 100; i++) {
    const randomOrder = randomOrders();
    await OrdersModel.create(randomOrder);
    console.log(`ITERATION ==========> ${i} <================`);
  }
};

export const fillingTablesWithOrdersItems = async () => {
  const { randomOrdersItems } = generateRandomData();

  for (let i = 0; i < 200; i++) {
    const randomOrdersItem = randomOrdersItems();
    await OrdersItemsModel.create(randomOrdersItem);
    console.log(`ITERATION ==========> ${i} <================`);
  }
};

export const filingTablesWishLists = async () => {
  const { randomWishLists } = generateRandomData();

  for (let i = 0; i < 100; i++) {
    const randomWishList = randomWishLists();
    await WishlistsModel.create(randomWishList);
    console.log(`ITERATION ==========> ${i} <================`);
  }
};

export const fillingTablesCart = async () => {
  const { randomCart } = generateRandomData();

  for (let i = 0; i < 200; i++) {
    const randomCartItem = randomCart();
    await CartsModel.create(randomCartItem);
  }
};

export const fillingTablesAddresses = async () => {
  const { randomAddresses } = generateRandomData();

  for (let i = 0; i < 100; i++) {
    const randomAddress = randomAddresses();
    await AddressModel.create(randomAddress);
    console.log(`ITERATION ==========> ${i} <================`);
  }
};
