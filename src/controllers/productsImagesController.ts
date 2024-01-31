import { uriImageLinkSchema } from './../validators/validations';
import { ProductsImagesModel } from './../models/productsImages';
import { Request, Response } from "express";
import cloudinary from "../config/fileSystem";
import imageThumbnail from "image-thumbnail"

let thumbnailOptions : any= { width: 100, height: 100, fit:"inside", responseType: 'base64', jpegOptions: { force:true, quality:100 } }

export const getAllImagesById = async (req:Request ,res:Response) =>{
    try{
        const id = req.params.id;
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }
        const images = await ProductsImagesModel.findAll({
            where:{
                product_id:id,
            }
        });

        return res.status(200).json({message:"success",productsImages:images})
    }catch(error){
        console.log(error);
        return res.status(500).json({error})
    }
}

export const createProductImages = async (req :Request,res:Response)=>{
    try{
        const productId = req.body.productId;
        if(Number.isNaN(productId)){
            return res.sendStatus(400);
        }
        const alt = req.body.alt;
        const isMain = req.body.isMain;
        console.log(isMain)
        if(isMain != "false" && isMain != "true"){
            return res.status(400).json({error:"isMain is required"})
        }

        const imageFile : any = req.files;
        if(imageFile?.length == 0){
            return res.status(400).json({error:"missing image"})
        }
        if( imageFile?.length > 10){
            return res.status(400).json({error:"max allowed 10 images at once"})
        }
        const mainImages : any = [];
        const thumbnails : any = [];
        const expectedLength = imageFile.length;
    
        for(let i =0;i <imageFile.length;i++){
            await (async function run() {
                let base64Image = imageFile[i].buffer.toString('base64');
                let UploadedImage = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`,{
                    use_filename: true,
                    resource_type:"image",
                    folder:process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH,
                    transformation:[{width:1400,height:1400,crop:"fit"}]
                })
                let thumbnail = await imageThumbnail(`${base64Image}`,thumbnailOptions)
                mainImages.push(UploadedImage.secure_url);

                let thumbnailImg : any;
                let uploadedThumbnail = await cloudinary.uploader.upload(`data:image/png;base64,${thumbnail}`,{
                    use_filename: true,
                    resource_type:"image",
                    folder:process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH,
                })
                thumbnailImg = uploadedThumbnail.secure_url;
                thumbnails.push(uploadedThumbnail.secure_url)

                const insertNewProductImagesToDb = await ProductsImagesModel.create({
                    product_id:productId,
                    image_url: UploadedImage.secure_url,
                    thumbnail_url:thumbnailImg,
                    alt,
                    isMain,
                })         
              })(); 
        }

        if(expectedLength == mainImages.length){
            return res.status(201).json({
                message: "success",
                productId,
                productImages:mainImages,
                thumbnails,
            }); 
        }else{
            return res.status(409).json({
                message: "success",
                productId,
                productImages:mainImages,
                thumbnails,
        })}
        
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}

export const updateProductImage = async (req: Request,res:Response) =>{
    try{
        const id = Number(req.params.id);
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
        const { error :invalidImage } = uriImageLinkSchema.validate(url);
        if(invalidImage){
            return res.status(400).json({error:"Invalid image"});
        }

        let splitted = url.split("/");
        let imgWithExt = splitted[splitted.length - 1]
        let img = imgWithExt.split(".")[0]
        console.log(img,"img")

        let deletedImg = await cloudinary.api.delete_resources(
            [`${process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH}/${img}`],
            { type: 'upload', resource_type: 'image' }
        )
        console.log(deletedImg);

        let UploadedImage : any = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`,{
            use_filename: true,
            resource_type:"image",
            folder:process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH,
            transformation:[{width:1400,height:1400,crop:"fit"}]
          }).then(async(result)=>{
            const updateImage : any = await ProductsImagesModel.update({
                image_url:result.secure_url
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

export const changeImageAlt = async (req:Request,res:Response)=>{
    try{
        const id = Number(req.params.id);
        if(Number.isNaN(id)){
            return res.sendStatus(400);
        }
        const alt : string= req.body._alt;
        
        if(typeof alt != "string" || alt.length > 40){
            return res.sendStatus(400);
        }
        const updateImage = await ProductsImagesModel.update({
            alt:alt
        },{
            where:{
                id:id,
            }
        })

        if(updateImage[0] == 0){
            return res.status(400).json({error:"no such product exist"});
        }

        return res.status(201).json({message:"success",newAlt:alt})
    }catch(error){
        console.log(error);
        return res.status(500).json({error});
    }
}