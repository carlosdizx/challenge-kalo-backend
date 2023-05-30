import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../enums/typesUser";
import ArticlesCrudService from "../../services/articles.crud.service";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import {getUserId} from "../../utils/AuthUtils";
const originalHandler  = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    if(!event.body)
        return responseObject(400, {message: 'Form data is required'});
    const token = event.headers.authorization.split(" ")[1];
    const userId = getUserId(token);
    if(!userId)
        return responseObject(409, {message: 'JWT token no contain user id!'});
    const {title, body} = event.body;
    return await ArticlesCrudService.createArticle({title, body}, userId);
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER]))
    .use(httpJsonBodyParser())
    .handler(originalHandler);
