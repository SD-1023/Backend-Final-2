import { ProductsImagesModel } from "./../models/productsImages";
import { ProductsThumbnailImagesModel } from "./../models/productsThumbnailsImages";
import { Request, Response } from "express";
import { ProductsModel } from "../models/products";
import { Op } from "sequelize";
import { productValidator } from "../validators/validations";
import dotenv from "dotenv";
import { applyFileSystem } from "../config/fileSystem";
import { ReviewsModel } from "../models/reviews";
import { sequelize } from "../config/database";
import cloudinary from "../config/fileSystem";

dotenv.config();
applyFileSystem();

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

  const category = req.query.category as unknown as String;

  if (
    category &&
    (category == "Steel" ||
      category == "Watches" ||
      category == "Skincare" ||
      category == "Handbags" ||
      category == "Sun Glasses")
  ) {
    conditions = {
      ...conditions,
      category: category,
    };
  }

  const products = await ProductsModel.findAll({
    where: conditions,
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("rating")), "averageStars"],
        [sequelize.fn("COUNT", sequelize.col("rating")), "ratingNumbers"],
      ],
    },
    include: [
      {
        model: ReviewsModel,
        attributes: [],
      },
    ],
    group: ["products.id"],
    subQuery: false,
    order: sort,
    limit: Number(limit),
    offset: (page - 1) * limit,
  });

  const count = await ProductsModel.count({ where: conditions });
  return res
    .status(200)
    .json({ data: { message: "success", count, page, limit, products } });
};

export const getNewArrivals = async (req: Request, res: Response) => {
  try {
    const latestProducts = await ProductsModel.findAll({
      order: [["createdAt", "DESC"]],
      limit: 4,
    });

    return res
      .status(200)
      .json({ data: { message: "success", latestProducts } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.sendStatus(400);
  }

  let product = await ProductsModel.findByPk(id, {
    include: [
      {
        model: ReviewsModel,
      },
      {
        model: ProductsThumbnailImagesModel,
        attributes: ["id", "image_thumbnail_url"],
      },
      {
        model: ProductsImagesModel,
        attributes: ["id", "image_url"],
      },
    ],
  });

  let [[{ avgRate }]]: any = await sequelize.query(
    `SELECT AVG(rating) as avgRate FROM reviews WHERE product_id = ${id}`
  );
  if (Number.isNaN(avgRate)) {
    avgRate = 0;
  }

  return res.status(200).json({
    data: {
      message: "success",
      product: { ...product?.dataValues, averageRating: Number(avgRate) },
    },
  });
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = req.body;
    const { error, value: validatedNewProduct } =
      productValidator.validate(newProduct);
    if (error) {
      return res.status(400).json({ error });
    }
    const imageFile = req.files;
    if (imageFile?.length == 0) {
      return res.status(400).json({ error: "missing image" });
    }
    const [{ buffer }]: any = imageFile;
    let base64Image = buffer.toString("base64");

    let UploadedImage = await cloudinary.uploader
      .upload(`data:image/png;base64,${base64Image}`, {
        use_filename: true,
        resource_type: "image",
        folder: process.env.PRODUCTS_IMAGES_FOLDER_PATH,
        transformation: [{ width: 1400, height: 1400, crop: "fit" }],
      })
      .then((result) => {
        const insertNewProductToDB = ProductsModel.create({
          name: validatedNewProduct.name,
          category: validatedNewProduct.category,
          price: validatedNewProduct.price,
          description: validatedNewProduct.description,
          finalPrice: validatedNewProduct.finalPrice,
          Category__Id: validatedNewProduct.categoryId,
          newArrivals: validatedNewProduct.newArrivals,
          discount: validatedNewProduct.discount,
          quantity: validatedNewProduct.quantity,
          image_secure_url: result.secure_url,
        }).then(() => {
          validatedNewProduct.image_secure_url = result.secure_url;
          return res.status(201).json({
            data: {
              message: "success",
              product: validatedNewProduct,
            },
          });
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const newProduct = req.body;
  const id = Number(req.params.id);

  const { error: errorProduct, value: validatedNewProduct } =
    productValidator.validate(newProduct);
  if (errorProduct) {
    return res.status(400).json({ errorProduct });
  }

  if (Number.isNaN(id)) {
    return res.sendStatus(400);
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

  if (Number.isNaN(id)) {
    return res.sendStatus(400);
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
