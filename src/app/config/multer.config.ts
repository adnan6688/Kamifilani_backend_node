
import multer from "multer"
import { cloudinaryUpload } from "./Cloudinary.config"
import streamifier from 'streamifier'


const storage = multer.memoryStorage()


export const upload = multer({ storage })


export const uploadToCloudinary = (buffer: Buffer) => {



    return new Promise((resolve, reject) => {

        const stream = cloudinaryUpload.uploader.upload_stream({ folder: "news", resource_type: "auto" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinaryUpload.uploader.destroy(publicId);

    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    throw new Error("Cloudinary image delete failed");
  }
};