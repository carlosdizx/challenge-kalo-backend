import "reflect-metadata";
import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import UsersAuthService from "../../services/users.auth.service";
import User from "../../entities/User.entity";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";

const originalHandler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    if (typeof event.body === "string"){
        const {name, email, password} = JSON.parse(event.body);

        if (name.trim() === "")
            return responseObject(400, { message: "Name is required" });
        else if (email.trim() === "")
            return responseObject(400, { message: "Email is required" });
        else if (password.trim() === "")
            return responseObject(400, { message: "Password is required" });

        const {body} = await UsersAuthService.create(name, email, password);
        const user: User = JSON.parse(body);
        return responseObject(200, {message: `User created: ${user.email}`});
    }
    return responseObject(400, {message: "Body is required"});
};

export const handler = middy(originalHandler)
    .use(hasTokenValid([TypesUser.ADMIN, TypesUser.ENTERPRISE]));
