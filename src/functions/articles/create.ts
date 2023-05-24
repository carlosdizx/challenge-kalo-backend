import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";

const originalHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    if (typeof event.body === "string"){
        console.log("--------------------------------");
        console.log(event.body);
        console.log("--------------------------------");
        return responseObject(400, {message: "Body is required"});
    }
    return responseObject(400, {message: "Body is required"});
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER, TypesUser.ADMIN]))
    .handler(originalHandler);
