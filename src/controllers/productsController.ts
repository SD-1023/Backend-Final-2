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
<<<<<<< HEAD
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
=======
  let page = Number(req.query.page) || 1;
  let limit = Number(req.query.limit) || 9;

  if (page < 0) {
    page = 1;
  }
  if (limit > 80 || limit < 0) {
    limit = 9;
  }

  const search = req.query.search?.toString();
  let conditions: any = {};

  if (search) {
    conditions.name = {
      [Op.like]: `%${req.query.search}%`,
    };
  }

  let greaterThan;
  if (!Number.isNaN(req.query["gte"])) {
    greaterThan = Number(req.query["gte"]);
  }

  let lessThan;
  if (!Number.isNaN(req.query["lte"])) {
    lessThan = Number(req.query["lte"]);
  }

  if (greaterThan) {
    conditions = {
      ...conditions,
      price: {
        [Op.gte]: greaterThan,
      },
    };
  }

  if (lessThan) {
    conditions = {
      ...conditions,
      price: {
        ...conditions["price"],
        [Op.lte]: lessThan,
      },
    };
  }

  let sort: any = req.query.sort;
  if (
    sort &&
    (sort == "-name" || sort == "name" || sort == "price" || sort == "-price")
  ) {
    let dir;
    sort.includes("-") ? (dir = "DESC") : (dir = "ASC");
    sort = [[`${sort.replace("-", "")}`, dir]];
  } else {
    sort = [["id", "ASC"]];
  }

  const products = await ProductsModel.findAll({
    where: conditions,
    order: sort,
    limit: Number(limit),
    offset: (page - 1) * limit,
  });

  const count = await ProductsModel.count({ where: conditions });
  return res
    .status(200)
    .json({ data: { message: "success", count, page, limit, products } });
>>>>>>> a552aa9021ca4dadb4698a9c27f49db6934fe328
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
<<<<<<< HEAD

=======
>>>>>>> a552aa9021ca4dadb4698a9c27f49db6934fe328
  const { error, value: validatedNewProduct } =
    productValidator.validate(newProduct);
  if (error) {
    return res.status(400).json({ error });
  }

<<<<<<< HEAD
  const imagePath =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";
  // * Both image path and base64 works

  let image_secureUrl;
  try {
    await cloudinary.uploader
      .upload(imagePath, {
        folder: process.env.PRODUCTS_IMAGES_FOLDER_PATH,
        resource_type: "image",
=======
  const image = `data:image/png;base64,${validatedNewProduct.product_image}`;
  let image_secureUrl;
  try {
    await cloudinary.uploader
      .upload(image, {
        folder: process.env.PRODUCTS_IMAGES_FOLDER_PATH,
        use_filename: true,
        resource_type: "image",
        transformation: [{ width: 200, height: 200, crop: "fit" }],
>>>>>>> a552aa9021ca4dadb4698a9c27f49db6934fe328
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
<<<<<<< HEAD
=======
  validatedNewProduct.product_image = undefined;
  // removing base64 from returned response
>>>>>>> a552aa9021ca4dadb4698a9c27f49db6934fe328

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
