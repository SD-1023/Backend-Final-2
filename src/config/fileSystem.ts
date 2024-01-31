import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

export const applyFileSystem = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });
};

export const deleteImgFromFileSystem = async (imageSecureUrl : string,PathOfCloudinary : string)=>{
    
    if(PathOfCloudinary != process.env.PRODUCTSTHUMBNAIL_IMAGES_FOLDER_PATH &&
       PathOfCloudinary != process.env.PRODUCTS_IMAGES_FOLDER_PATH  &&
       PathOfCloudinary != process.env.PRODUCTSIMAGESCOLLECTION_IMAGES_FOLDER_PATH &&
       PathOfCloudinary != process.env.USERS_IMAGES_FOLDER_PATH){
        return new Error("Invalid Input")
    }else if(!imageSecureUrl || imageSecureUrl.trim() == ""){
            return new Error("Invalid Input")
    }
    //console.log("WE HAVE PASSED THE CONDITIONS ")
    let splitted = imageSecureUrl.split("/");
    let imgWithExt = splitted[splitted.length - 1]
    let img = imgWithExt.split(".")[0]
    //console.log(img,"img");

    let deletedImg = await cloudinary.api.delete_resources(
      [`${PathOfCloudinary}/${img}`],
      { type: 'upload', resource_type: 'image' }
    );

    return deletedImg;
}

export default cloudinary;

