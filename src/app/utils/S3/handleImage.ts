
import { envVars } from "../../config/env";
import multer from "multer";
import multerS3 from "multer-s3";


import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    region: 'us-west-1',
    credentials: {
        accessKeyId: String(envVars.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(envVars.AWS_SECRET_ACCESS_KEY),
    },
});


export const uploadImageS3 = multer({
    
    storage: multerS3({
        s3: s3,
        bucket: envVars.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const fileName = `images/${Date.now()}-${file.originalname}`;
            cb(null, fileName);
        },
    }),
});