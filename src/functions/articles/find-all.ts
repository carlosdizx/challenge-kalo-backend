import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";
import ArticlesCrudService from "../../services/articles.crud.service";
const originalHandler: APIGatewayProxyHandler  = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    try {
        const userId = event.requestContext.authorizer.claims.id;
        return await ArticlesCrudService.findAllArticles(userId);
    }
    catch (err) {
        return responseObject(500, 'Failed to find article!');
    }
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER]))
    .handler(originalHandler);
