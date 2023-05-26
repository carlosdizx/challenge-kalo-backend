import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";
import UserCrudService from "../../services/user.crud.service";

const originalHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    const {id} = event.pathParameters;
    return UserCrudService.findUserById(id);
};

export const handler = middy(originalHandler)
    .use(hasTokenValid([TypesUser.ADMIN]));
