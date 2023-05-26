import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {parseTypeUser, TypesUser} from "../../Enums/typesUser";
import httpMultipartBodyParser from '@middy/http-multipart-body-parser'
import UserCrudService from "../../services/user.crud.service";
import responseObject from "../../utils/Response";

const originalHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    const {id: idSend} = event.pathParameters;
    const userId = event.requestContext.authorizer.claims.id;
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
    if(typeUserFound === null || (typeUserFound === TypesUser.USER && idSend !== userId))
        return responseObject(403, { message: "You have not permissions" });
    return await UserCrudService.update(idSend);
};

export const handler = middy(originalHandler)
    .use(hasTokenValid([TypesUser.ADMIN, TypesUser.USER]))
    .use(httpMultipartBodyParser());
