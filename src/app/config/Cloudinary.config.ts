







import { v2  as cloudinary} from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
    cloud_name : envVars.CLOUD_NAME,
    api_key : envVars.CLOUD_API_KEY,
    api_secret : envVars.CLOUD_API_SECRET
})



//Amader folder -> image -> form-data -> file -> multer -> nijer folder(temporary) make korbe cloudinary te  -> req?.file -> package(req.file) -> url -> req.file-> mongoose -> mongodb


export const cloudinaryUpload = cloudinary