import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import config from "@/config";

const s3Client = new S3Client({
    region: config.AWS_REGION,
    credentials: {
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAcoccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });