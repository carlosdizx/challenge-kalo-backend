import {APIGatewayProxyHandler} from "aws-lambda";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {parseTypeUser, TypesUser} from "../../enums/typesUser";
import UserCrudService from "../../services/user.crud.service";
import responseObject from "../../utils/Response";
import {getUserId} from "../../utils/AuthUtils";

const originalHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    const token = event.headers.authorization.split(" ")[1];
    const userId = getUserId(token);
    if(!userId)
        return responseObject(409, {message: 'JWT token no contain user id!'});

    const {id} = event.pathParameters;
    const response = await UserCrudService.findUserById(userId);
    const user = JSON.parse(response.body);
    const typeUserFound = parseTypeUser(user.type);
    if(typeUserFound === null || (typeUserFound === TypesUser.USER && id !== userId))
        return responseObject(403, { message: "You have not permissions" });
    return response;
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.ADMIN, TypesUser.USER]))
    .handler(originalHandler);
