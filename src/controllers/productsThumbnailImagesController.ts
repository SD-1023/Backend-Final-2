import { ProductsThumbnailImagesModel } from './../models/productsThumbnailsImages';
import { Request, Response } from "express";
import cloudinary from "../config/fileSystem";

export const getAllProductThumbnailImagesById = async (req : Request ,res:Response)=>{
    try{
        const id = req.params.id;
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }

        const productsThumbnails = await ProductsThumbnailImagesModel.findAll({
            where:{
                product_id:id
            }
        })
        return res.status(200).json({message:"success",productsThumbnails})

    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}
export const createProductThumbnailImages = async (req :Request,res:Response)=>{
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
        const thumbnailImages : any = [];
        const expectedLength = imageFile.length;

        
        imageFile?.forEach(async(e : any)=>{
                let base64Image = e.buffer.toString('base64');
                let UploadedImage = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`,{
                  use_filename: true,
                  resource_type:"image",
                  folder:process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH,
                  transformation:[{width:400,height:400,crop:"fit"}]
                }).then((result)=>{
                    thumbnailImages.push(result.secure_url);
                  const insertNewProductThumbnailToDB = ProductsThumbnailImagesModel.create({
                    product_id:productId,
                    image_thumbnail_url: result.secure_url,
                }).then(()=>{
                    if(expectedLength == thumbnailImages.length){
                        return res.status(201).json({
                              message: "success",
                              productId,
                              thumbnailImages:thumbnailImages
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

export const updateProductThumbnailImage = async (req: Request,res:Response) =>{
    try{
        const id = req.params.id;
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }
        if(req.file == undefined){
            return res.status(400).json({error:"missing image"});
        }
        if(!req.body.imageUrl){
            return res.sendStatus(400);
        }

        const imageFile = req.file;
            const { buffer } : any = imageFile;
            let base64Image = buffer.toString('base64');

        let url : string = req.body.imageUrl
        let splitted = url.split("/");
        let imgWithExt = splitted[splitted.length - 1]
        let img = imgWithExt.split(".")[0]
        console.log(img,"img")
        let deletedImg = await cloudinary.api.delete_resources(
            [`${process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH}/${img}`],
            { type: 'upload', resource_type: 'image' }
        )
        console.log(deletedImg);
        

        let UploadedImage : any = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`,{
            use_filename: true,
            resource_type:"image",
            folder:process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH,
            transformation:[{width:400,height:400,crop:"fit"}]
          }).then(async(result)=>{
            const updateImage : any = await ProductsThumbnailImagesModel.update({
                image_thumbnail_url:result.secure_url
            },{
                where:{
                    id:id,
                }
            })
        }).then(()=>{
            return res.status(201).json({message:"success"})
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}