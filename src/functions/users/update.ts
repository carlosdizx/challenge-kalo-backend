import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {parseTypeUser, TypesUser} from "../../enums/typesUser";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import UserCrudService from "../../services/user.crud.service";
import responseObject from "../../utils/Response";
import {getUser, getUserId} from "../../utils/AuthUtils";

const originalHandler = async (event, context) => {
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

    const {name, email, password} = event.body;
    if (name && name.trim() === "")
        return responseObject(400, { message: "Name is required" });
    else if (email && email.trim() === "")
        return responseObject(400, { message: "Email is required" });
    else if (password && password.trim() === "")
        return responseObject(400, { message: "Password is required" });

    return await UserCrudService.update({name, email, password}, id);
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.ADMIN, TypesUser.USER]))
    .use(httpJsonBodyParser())
    .handler(originalHandler);
