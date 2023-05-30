import responseObject from "../../utils/Response";
import UsersAuthService from "../../services/users.auth.service";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";

export const originalHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    if(!event.body)
        return responseObject(400, {message: "Body is required"});

    const {name, email, password} = event.body;

    if (!name || name.trim() === "")
        return responseObject(400, { message: "Name is required" });
    else if (!email || email.trim() === "")
        return responseObject(400, { message: "Email is required" });
    else if (!password || password.trim() === "")
        return responseObject(400, { message: "Password is required" });

    return await UsersAuthService.registerUser({name, email, password});
};

export const handler = middy()
    .use(httpJsonBodyParser())
    .handler(originalHandler);
