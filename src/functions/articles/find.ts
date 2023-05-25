import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";
import {getFileUrl} from "../../utils/S3Config";
const originalHandler: APIGatewayProxyHandler  = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    try {
        const {id: articleId} = event.pathParameters;
        const userId = event.requestContext.authorizer.claims.id;
        return responseObject(200, {articleId, userId});
    }
    catch (err) {
        return responseObject(500, "alv");
    }
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER, TypesUser.ADMIN]))
    .handler(originalHandler);
