import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const Bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const s3Client = new S3Client({ region });

export const upload = async ({Key, Body}: {Key: string, Body: Buffer }) =>
{
    console.time("Upload File");
    const uploadCommand = new PutObjectCommand({
        Bucket,
        Key,
        Body
    });
    
    try {
        const response = await s3Client.send(uploadCommand);
        console.timeEnd("Upload File");
        return response;
    }catch (e) {
        throw e;
    }
}
