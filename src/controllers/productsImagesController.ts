import { ProductsImagesModel } from './../models/productsImages';
import { Request, Response } from "express";
import cloudinary from "../config/fileSystem";

export const createProductImages = async (req :Request,res:Response)=>{
    try{
        const productId = req.body.productId;
        if(Number.isNaN(productId)){
            return res.sendStatus(400);
        }

        const imageFile : any = req.files;
        if(imageFile?.length == 0){
            return res.status(400).json({error:"missing image"})
        }
        if( imageFile?.length > 10){
            return res.status(400).json({error:"max allowed 10 images at once"})
        }
        const mainImages : any = [];
        const expectedLength = imageFile.length;

        
        imageFile?.forEach(async(e : any)=>{
                let base64Image = e.buffer.toString('base64');
                let UploadedImage = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`,{
                  use_filename: true,
                  resource_type:"image",
                  folder:process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH,
                  transformation:[{width:1400,height:1400,crop:"fit"}]
                }).then((result)=>{
                    mainImages.push(result.secure_url);
                  const insertNewProductThumbnailToDB = ProductsImagesModel.create({
                    product_id:productId,
                    image_url: result.secure_url,
                }).then(()=>{
                    if(expectedLength == mainImages.length){
                        return res.status(201).json({
                            data: {
                              message: "success",
                              productId,
                              productImages:mainImages,
                            },
                        }); 
                    }
                }).catch((error)=>{
                    console.log(error);
                    return res.status(400).json({error:"Uploading was not completed successfully for all images"})
                })
            })
        }) 
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}