import {APIGatewayProxyHandler} from "aws-lambda";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {parseTypeUser, TypesUser} from "../../enums/typesUser";
import responseObject from "../../utils/Response";
import {getUser} from "../../utils/AuthUtils";
import UserCrudService from "../../services/user.crud.service";

const originalHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    const token = event.headers.authorization.split(" ")[1];
    const requestingUser = getUser(token);
    if(!requestingUser)
        return responseObject(409, {message: 'JWT is invalid'});

    const {id} = event.pathParameters;
    const response = await UserCrudService.findUserById(id);
    const typeUserReq = parseTypeUser(requestingUser.type);

    if (typeUserReq !== TypesUser.ADMIN){
        if(response.statusCode !== 200)
            return responseObject(404, { message: "User not found or id is invalid" });
        const userFound = JSON.parse(response.body);
        if(requestingUser.id !== userFound.id)
            return responseObject(403, { message: "You do not have permission" });
    }
    return response;
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.ADMIN, TypesUser.USER]))
    .handler(originalHandler);
