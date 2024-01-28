import { deleteImgFromFileSystem } from "./../config/fileSystem";
import { productValidatorForUpdate } from "./../validators/validations";
import imageThumbnail from "image-thumbnail";
import { ProductsImagesModel } from "./../models/productsImages";
import { Request, Response } from "express";
import { ProductsModel } from "../models/products";
import { Op, Transaction } from "sequelize";
import {
  productValidator,
  uriImageLinkSchema,
} from "../validators/validations";
import dotenv from "dotenv";
import { applyFileSystem } from "../config/fileSystem";
import { ReviewsModel } from "../models/reviews";
import { sequelize } from "../config/database";
import cloudinary from "../config/fileSystem";

dotenv.config();
applyFileSystem();

let thumbnailOptions: any = {
  width: 100,
  height: 100,
  fit: "inside",
  responseType: "base64",
  jpegOptions: { force: true, quality: 100 },
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    if (page < 0) {
      page = 1;
    }
    if (limit > 80 || limit < 0) {
      limit = 9;
    }

    const search = req.query.search as string;
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
      (sort == "-name" ||
        sort == "name" ||
        sort == "price" ||
        sort == "-price" ||
        sort == "stars" ||
        sort == "-stars")
    ) {
      let dir;
      sort.includes("-") ? (dir = "DESC") : (dir = "ASC");
      if (!sort.includes("stars")) {
        sort = [[`${sort.replace("-", "")}`, dir]];
      }

      if (sort == "stars" || sort == "-stars") {
        sort = [[`averageStars`, dir]];
      }
    } else {
      sort = [["id", "ASC"]];
    }

    const category = req.query.category as unknown as String;

    if (
      category &&
      (category == "Skincare" ||
        category == "Watches" ||
        category == "Jewellery" ||
        category == "Handbags" ||
        category == "Eyewear")
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
      .json({ message: "success", count, page, limit, products });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
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
  try {
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
          model: ProductsImagesModel,
        },
      ],
      order: [
        [ProductsImagesModel, "isMain", "DESC"],
        [ProductsImagesModel, "id", "ASC"],
      ],
    });

    let [[{ avgRate }]]: any = await sequelize.query(
      `SELECT AVG(rating) as avgRate FROM reviews WHERE product_id = ${id}`
    );
    if (Number.isNaN(avgRate)) {
      avgRate = 0;
    }

    return res.status(200).json({
      message: "success",
      product: { ...product?.dataValues, averageRating: Number(avgRate) },
    });
  } catch (error) {
    return res.sendStatus(500);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  let fullPictureImagePasser: any;
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

    (async function run() {
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${base64Image}`,
        {
          use_filename: true,
          resource_type: "image",
          folder: process.env.PRODUCTS_IMAGES_FOLDER_PATH,
          transformation: [{ width: 1400, height: 1400, crop: "fit" }],
        }
      );
      fullPictureImagePasser = result;
      const { error } = uriImageLinkSchema.validate(result.secure_url);
      if (error) {
        return res
          .status(500)
          .json({ error: "Image was not processed properly" });
      }

      // * Transaction start
      let t1: Transaction = await sequelize.transaction();
      let passingImageThumbnailToCatchBlock;
      try {
        const insertNewProductToDB = await ProductsModel.create(
          {
            name: validatedNewProduct.name,
            category: validatedNewProduct.category,
            price: validatedNewProduct.price,
            description: validatedNewProduct.description,
            finalPrice: validatedNewProduct.finalPrice,
            Category__Id: validatedNewProduct.categoryId,
            offer: validatedNewProduct.offer,
            alt: validatedNewProduct.alt,
            quantity: validatedNewProduct.quantity,
            image_secure_url: result.secure_url,
          },
          { transaction: t1 }
        );

        let thumbnail = await imageThumbnail(
          `${base64Image}`,
          thumbnailOptions
        );

        validatedNewProduct.image_secure_url = result.secure_url;
        console.log(insertNewProductToDB);
        let uploadedThumbnail = await cloudinary.uploader.upload(
          `data:image/png;base64,${thumbnail}`,
          {
            use_filename: true,
            resource_type: "image",
            folder: process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH,
          }
        );

        passingImageThumbnailToCatchBlock = uploadedThumbnail;
        console.log(uploadedThumbnail);
        const { error: thumbnailFailed } = uriImageLinkSchema.validate(
          uploadedThumbnail.secure_url
        );

        if (thumbnailFailed) {
          await t1.rollback();
          return res.status(400).json({ error: "Thumbnail was failed" });
        }

        const insertImagesToDBWithThumbnail = await ProductsImagesModel.create(
          {
            product_id: insertNewProductToDB.dataValues.id,
            image_url: result.secure_url,
            thumbnail_url: uploadedThumbnail.secure_url,
            alt: validatedNewProduct.alt,
            isMain: true,
          },
          { transaction: t1 }
        );

        await t1.commit();
        return res.status(201).json({
          message: "success",
          product: validatedNewProduct,
          thumbnails: insertImagesToDBWithThumbnail,
        });
      } catch (error) {
        if (passingImageThumbnailToCatchBlock != undefined) {
          await deleteImgFromFileSystem(
            passingImageThumbnailToCatchBlock.secure_url,
            process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH as string
          );
        }
        if (passingImageThumbnailToCatchBlock != undefined) {
          await deleteImgFromFileSystem(
            result.secure_url,
            process.env.PRODUCTS_IMAGES_FOLDER_PATH as string
          );
        }
        await t1.rollback();
        console.log(error);
        return res.status(500).json({ error });
      }
    })();
  } catch (error) {
    if (fullPictureImagePasser != undefined) {
      await deleteImgFromFileSystem(
        fullPictureImagePasser.secure_url,
        process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH as string
      );
    }
    console.log(error);
    return res.status(500).json({ error });
  }
};

// * Update Products ===================================================================
export const updateProduct = async (req: Request, res: Response) => {
  let thumbnailPasser: any;
  let fullImagePasser: any;
  try {
    const newProduct = req.body;
    const id = Number(req.params.id);

    const { error: errorProduct, value: validatedNewProduct } =
      productValidatorForUpdate.validate(newProduct);
    if (errorProduct) {
      console.log(errorProduct);
      return res.status(400).json({ errorProduct });
    }

    if (Number.isNaN(id)) {
      return res.sendStatus(400);
    }

    let updatedProduct: any = {};
    validatedNewProduct.name
      ? (updatedProduct["name"] = validatedNewProduct.name)
      : null;
    validatedNewProduct.category
      ? (updatedProduct["category"] = validatedNewProduct.category)
      : null;
    validatedNewProduct.price
      ? (updatedProduct["price"] = validatedNewProduct.price)
      : null;
    validatedNewProduct.description
      ? (updatedProduct["description"] = validatedNewProduct.description)
      : null;
    validatedNewProduct.finalPrice
      ? (updatedProduct["finalPrice"] = validatedNewProduct.finalPrice)
      : null;
    validatedNewProduct.Category__Id
      ? (updatedProduct["Category__Id"] = validatedNewProduct.Category__Id)
      : null;
    validatedNewProduct.offer
      ? (updatedProduct["offer"] = validatedNewProduct.offer)
      : null;
    validatedNewProduct.alt
      ? (updatedProduct["alt"] = validatedNewProduct.alt)
      : null;
    validatedNewProduct.quantity
      ? (updatedProduct["quantity"] = validatedNewProduct.quantity)
      : null;
    validatedNewProduct.imageUrl
      ? (updatedProduct["image_secure_url"] = validatedNewProduct.imageUrl)
      : null;

    let url: string = req.body.imageUrl;
    // * if(url) will be for cases when we have images sent to be updated
    // * url is an image to delete by default all products assumed to have an image,
    //* so if he does not send an image to be replaced we assume that this person wants to update the normal info

    if (url) {
      const { error: invalidImage } = uriImageLinkSchema.validate(url);
      if (invalidImage) {
        return res.status(400).json({ error: "Invalid image" });
      }
      let splitted = url.split("/");
      let imgWithExt = splitted[splitted.length - 1];
      let img = imgWithExt.split(".")[0];
      console.log(img, "img");

      const productToBeChangedIfItExist: any = await ProductsModel.findOne({
        where: {
          id: id,
          image_secure_url: url,
        },
      });

      if (productToBeChangedIfItExist == null) {
        return res
          .status(400)
          .json({ error: "Product or image does not exist" });
      }

      let deletedImg = await cloudinary.api.delete_resources(
        [`${process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH}/${img}`],
        { type: "upload", resource_type: "image" }
      );
      console.log(deletedImg);

      const imageFile = req.file;
      console.log(imageFile);
      if (imageFile?.fieldname != "image" || imageFile == undefined) {
        return res
          .status(400)
          .json({ error: "missing image or invalid giving name" });
      }
      const { buffer }: any = imageFile;
      let base64Image = buffer.toString("base64");
      let UploadedImage: any;

      let t2: Transaction = await sequelize.transaction();
      await (async function run() {
        const result = await cloudinary.uploader.upload(
          `data:image/png;base64,${base64Image}`,
          {
            use_filename: true,
            resource_type: "image",
            folder: process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH,
            transformation: [{ width: 1400, height: 1400, crop: "fit" }],
          }
        );
        UploadedImage = result;
        fullImagePasser = result;
        const updateImage: any = await ProductsImagesModel.update(
          {
            image_url: result.secure_url,
          },
          {
            where: {
              id: id,
            },
            transaction: t2,
          }
        );
      })();

      let thumbnail = await imageThumbnail(`${base64Image}`, thumbnailOptions);

      let uploadedThumbnail = await cloudinary.uploader.upload(
        `data:image/png;base64,${thumbnail}`,
        {
          use_filename: true,
          resource_type: "image",
          folder: process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH,
        }
      );
      console.log(uploadedThumbnail);
      const { error: thumbnailFailed } = uriImageLinkSchema.validate(
        uploadedThumbnail.secure_url
      );
      if (thumbnailFailed) {
        return res.status(400).json({ error: "Thumbnail was failed" });
      }
      console.log(UploadedImage.secure_url, "UploadedImage");

      try {
        const updateImages = await ProductsImagesModel.update(
          {
            image_url: UploadedImage.secure_url,
            thumbnail_url: uploadedThumbnail.secure_url,
          },
          {
            where: {
              product_id: id,
            },
            transaction: t2,
          }
        );
        console.log(updatedProduct);
        console.log(updateImages, "updatedImages");
        const updateNewProductInDB = await ProductsModel.update(
          {
            ...updatedProduct,
          },
          {
            where: {
              id: id,
            },
            transaction: t2,
          }
        );
      } catch (error) {
        if (fullImagePasser != undefined) {
          await deleteImgFromFileSystem(
            fullImagePasser.secure_url,
            process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH as string
          );
        }
        if (thumbnailPasser != undefined) {
          await deleteImgFromFileSystem(
            fullImagePasser.secure_url,
            process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH as string
          );
        }
        console.log(error);
        await t2.rollback();
        return res.status(400).json({ error });
      }

      await t2.commit();
    } else {
      // * In case was sent by the admin this case here deals with update with no images
      updatedProduct.image_secure_url = undefined;
      const updateNewProductInDB = await ProductsModel.update(
        {
          ...updatedProduct,
        },
        {
          where: {
            id: id,
          },
        }
      );
    }
    return res.status(201).json({
      message: "success",
      newProduct: updatedProduct,
    });
  } catch (error) {
    if (fullImagePasser != undefined) {
      await deleteImgFromFileSystem(
        fullImagePasser.secure_url,
        process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH as string
      );
    }
    if (thumbnailPasser != undefined) {
      await deleteImgFromFileSystem(
        thumbnailPasser.secure_url,
        process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH as string
      );
    }
    return res.status(500).json({ error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const image: string = req.body.imageUrl;

    if (Number.isNaN(id)) {
      return res.sendStatus(400);
    }
    let deleteProduct, deleteProductsImages;
    let t3: Transaction = await sequelize.transaction();
    try {
      deleteProduct = await ProductsModel.destroy({
        where: {
          id: id,
        },
        transaction: t3,
      });

      deleteProductsImages = await ProductsImagesModel.destroy({
        where: {
          product_id: id,
        },
        transaction: t3,
      });
      await t3.commit();
    } catch (error) {
      await t3.rollback();
      console.log(error);
      return res.status(400).json({ error });
    }

    let splitted = image.split("/");
    let imgWithExt = splitted[splitted.length - 1];
    let img = imgWithExt.split(".")[0];
    console.log(img, "img");

    let deletedImg = await cloudinary.api.delete_resources(
      [`${process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH}/${img}`],
      { type: "upload", resource_type: "image" }
    );

    if (deleteProduct && deleteProductsImages) {
      return res.status(202).json({ message: "success" });
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};
