import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../enums/typesUser";
import ArticlesCrudService from "../../services/articles.crud.service";
import {getUserId} from "../../utils/AuthUtils";
const originalHandler: APIGatewayProxyHandler  = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    try {
        const token = event.headers.authorization.split(" ")[1];
        const userId = getUserId(token);
        if(!userId)
            return responseObject(409, {message: 'JWT token no contain user id!'});

        const {id: articleId} = event.pathParameters;
        const key = `${userId}/${articleId}`;
        return await ArticlesCrudService.findArticleById(articleId, key);
    }
    catch (err) {
        return responseObject(500, 'Failed to find article!');
    }
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER]))
    .handler(originalHandler);
