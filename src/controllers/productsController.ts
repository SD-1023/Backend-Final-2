import { Request, Response } from "express";
import { ProductsModel } from "../models/products";
import { Op } from "sequelize";
import { idValidator, productValidator } from "../validators/validations";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

export const getAllProducts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10; // In this project it will be 9

  const products = await ProductsModel.findAll({
    where: {
      id: {
        [Op.gte]: page * limit - limit + 1,
      },
    },
    order: [["id", "ASC"]],
    limit: Number(limit),
  });

  return res.status(200).json({ data: { message: "success", products } });
};

export const getProductById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { error } = idValidator.validate({ id });

  if (error) {
    return res.status(400).json({ validationError: error.message });
  }

  const product = await ProductsModel.findByPk(id);
  return res.status(200).json({ product });
};

export const createProduct = async (req: Request, res: Response) => {
  const newProduct = req.body;
  const { error, value: validatedNewProduct } =
    productValidator.validate(newProduct);
  if (error) {
    return res.status(400).json({ error });
  }

  const image = `data:image/png;base64,${validatedNewProduct.product_image}`;
  let image_secureUrl;
  try {
    await cloudinary.uploader
      .upload(image, {
        folder: process.env.PRODUCTS_IMAGES_FOLDER_PATH,
        use_filename: true,
        resource_type: "image",
        transformation: [{ width: 200, height: 200, crop: "fit" }],
      })
      .then((result) => {
        console.log(result);
        image_secureUrl = result.secure_url;
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }

  validatedNewProduct.image_secure_url = image_secureUrl;
  validatedNewProduct.product_image = undefined;
  // removing base64 from returned response

  const insertNewProductToDB = await ProductsModel.create({
    name: validatedNewProduct.name,
    category: validatedNewProduct.category,
    price: validatedNewProduct.price,
    description: validatedNewProduct.description,
    finalPrice: validatedNewProduct.finalPrice,
    newArrivals: validatedNewProduct.newArrivals,
    discount: validatedNewProduct.discount,
    quantity: validatedNewProduct.quantity,
    image_secure_url: validatedNewProduct.image_secure_url,
  });

  return res.status(201).json({
    data: {
      message: "success",
      product: validatedNewProduct,
    },
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const newProduct = req.body;
  const id = Number(req.params.id);

  const { error: errorProduct, value: validatedNewProduct } =
    productValidator.validate(newProduct);
  if (errorProduct) {
    return res.status(400).json({ errorProduct });
  }

  const { error: idError } = idValidator.validate({ id });
  if (idError) {
    return res.status(400).json({ idError });
  }

  const updateNewProductInDB = await ProductsModel.update(
    {
      name: validatedNewProduct.name,
      category: validatedNewProduct.category,
      price: validatedNewProduct.price,
      description: validatedNewProduct.description,
      finalPrice: validatedNewProduct.finalPrice,
      newArrivals: validatedNewProduct.newArrivals,
      discount: validatedNewProduct.discount,
      quantity: validatedNewProduct.quantity,
    },
    {
      where: {
        id: id,
      },
    }
  );

  return res.status(201).json({
    data: { message: "success", newProduct: validatedNewProduct },
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const { error: idError } = idValidator.validate({ id });
  if (idError) {
    return res.status(400).json({ idError });
  }

  const deleteProduct = await ProductsModel.destroy({
    where: {
      id: id,
    },
  });

  if (deleteProduct) {
    return res.status(202).json({ data: { message: "success" } });
  } else {
    return res.sendStatus(204);
  }
};
