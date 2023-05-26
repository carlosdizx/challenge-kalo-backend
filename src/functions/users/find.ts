import {APIGatewayProxyHandler} from "aws-lambda";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {parseTypeUser, TypesUser} from "../../Enums/typesUser";
import UserCrudService from "../../services/user.crud.service";
import responseObject from "../../utils/Response";

const originalHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    const {id} = event.pathParameters;
    const userId = event.requestContext.authorizer.jwt.claims.id;
    const response = await UserCrudService.findUserById(id);
    const user = JSON.parse(response.body);
    const typeUserFound = parseTypeUser(user.type);
    if(typeUserFound === null || (typeUserFound === TypesUser.USER && id !== userId))
        return responseObject(403, { message: "You have not permissions" });
    return response;
};

export const handler = middy(originalHandler)
    .use(hasTokenValid([TypesUser.ADMIN, TypesUser.USER]));
