import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {parseTypeUser, TypesUser} from "../../enums/typesUser";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import UserCrudService from "../../services/user.crud.service";
import responseObject from "../../utils/Response";

const originalHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    const {id} = event.pathParameters;
    const userId = event.requestContext.authorizer.jwt.claims.id;
    const {body} = await UserCrudService.findUserById(userId);
    const user = JSON.parse(body);
    const {name, email, password} = event.body;
    const typeUserFound = parseTypeUser(user.type);

    if (name && name.trim() === "")
        return responseObject(400, { message: "Name is required" });
    else if (email && email.trim() === "")
        return responseObject(400, { message: "Email is required" });
    else if (password && password.trim() === "")
        return responseObject(400, { message: "Password is required" });
    else if(typeUserFound === null || (typeUserFound === TypesUser.USER && id !== userId))
        return responseObject(403, { message: "You have not permissions" });
    return await UserCrudService.update({name, email, password}, id);
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.ADMIN, TypesUser.USER]))
    .use(httpJsonBodyParser())
    .handler(originalHandler);
