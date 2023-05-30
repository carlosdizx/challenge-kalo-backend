import {GetObjectCommand, PutObjectCommand, S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

const Bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const s3Client = new S3Client({ region });

export const upload = async ({Key, Body, ContentType}: {Key: string, Body: Buffer, ContentType: string }) =>
{
    console.time("Upload File");
    const uploadCommand = new PutObjectCommand({
        Bucket,
        Key,
        Body,
        ContentType,
        ContentEncoding: "utf-8",
    });
    
    try {
        const response = await s3Client.send(uploadCommand);
        console.timeEnd("Upload File");
        return response;
    }catch (e) {
        throw e;
    }
}

export const getFileUrl = async (Key: string) => {
    const command = new HeadObjectCommand({
        Bucket,
        Key
    });

    try {
        await s3Client.send(command);
        return await getSignedUrl(s3Client, new GetObjectCommand({ Bucket, Key }));
    } catch (e) {
        throw e;
    }
};
