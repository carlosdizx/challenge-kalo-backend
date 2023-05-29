import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../enums/typesUser";
import UserCrudService from "../../services/user.crud.service";

const originalHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    if (typeof event.body === "string"){
        const {name, email, password, type} = JSON.parse(event.body);

        if (name.trim() === "")
            return responseObject(400, { message: "Name is required" });
        else if (email.trim() === "")
            return responseObject(400, { message: "Email is required" });
        else if (password.trim() === "")
            return responseObject(400, { message: "Password is required" });

        return await UserCrudService.create(name, email, password, type);
    }
    return responseObject(400, {message: "Body is required"});
};

export const handler = middy(originalHandler)
    .use(hasTokenValid([TypesUser.ADMIN]));
