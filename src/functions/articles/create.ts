import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";
import multipartBodyParser from "@middy/http-multipart-body-parser";
import ArticlesCrudService from "../../services/articles.crud.service";
const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

const originalHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    if (event.body) {
        const {title, body, image} = event.body;
        if (image) {
            const { filename, mimetype, encoding, truncated, content } = image;
            if(!allowedMimes.includes(mimetype))
                return responseObject(400,{message: "File is not image!"});

            const result = await ArticlesCrudService.createArticle({title,body, image});

            return responseObject(200, { message: 'Form data processed successfully', result });
        } else
            return responseObject(400, { message: 'Image data is required' });
    }

    return responseObject(400, { message: 'Form data is required' });
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER, TypesUser.ADMIN]))
    .handler(originalHandler);
