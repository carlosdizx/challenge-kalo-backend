import responseObject from "../../utils/Response";
import middy from "@middy/core";
import ArticlesCrudService from "../../services/articles.crud.service";
import {getUserId} from "../../utils/AuthUtils";
const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import httpMultipartBodyParser from '@middy/http-multipart-body-parser'

const originalHandler  = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    if(event.body){
        const token = event.headers.authorization.split(" ")[1];
        const userId = getUserId(token);
        if(!userId)
            return responseObject(409, {message: 'JWT token no contain user id!'});

        const {image} = event.body;
        if (!image)
            return responseObject(409, {message: 'Property image not found!'});

        const {mimetype, content} = image;

        if(!allowedMimes.includes(mimetype))
            return responseObject(400, {message: "File is not a image!"});

        const {id: articleId} = event.pathParameters;
        const isBuffer = Buffer.isBuffer(content);
        if(!isBuffer)
            return responseObject(409, {message: 'Image is corrupted'});

        return await ArticlesCrudService.uploadFileByArticle({image: content, type: mimetype}, articleId, userId);
    }
    return responseObject(400, {message: 'Form data is required'});
};

export const handler = middy()
    .use(httpHeaderNormalizer())
    .use(httpMultipartBodyParser())
    .handler(originalHandler);
