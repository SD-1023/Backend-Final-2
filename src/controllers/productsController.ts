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
