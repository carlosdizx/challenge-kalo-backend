import {APIGatewayProxyHandler} from "aws-lambda";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";
import UserCrudService from "../../services/user.crud.service";

const originalHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
   return UserCrudService.list();
};

export const handler = middy(originalHandler)
    .use(hasTokenValid([TypesUser.ADMIN]));
