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
        //d5299fd6-476f-4da2-8055-fb6e3f8270c9/addb724b-7ae5-4556-8168-f6b87e6ab401.png
        const file = await getFileUrl("d5299fd6-476f-4da2-8055-fb6e3f8270c9/addb724b-7ae5-4556-8168-f6b87e6ab401.png");
        return responseObject(200, file);
    }
    catch (err) {
        console.log(err);
        return responseObject(500, `alv: ${err}`);
    }
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER, TypesUser.ADMIN]))
    .handler(originalHandler);
