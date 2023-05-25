import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";
import ArticlesCrudService from "../../services/articles.crud.service";
const originalHandler: APIGatewayProxyHandler  = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    if(typeof event.body === "string") {
        const body = JSON.parse(event.body);
        console.log(body);
        return responseObject(400, {message: body});
    }
    return responseObject(400, {message: 'Form data is required'});
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER, TypesUser.ADMIN]))
    .handler(originalHandler);
