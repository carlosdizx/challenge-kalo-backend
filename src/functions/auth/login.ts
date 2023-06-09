import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import UsersAuthService from "../../services/users.auth.service";

export const handler: APIGatewayProxyHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    if (typeof event.body === "string"){
        const {email, password} = JSON.parse(event.body);

       if (email.trim() === "")
            return responseObject(400, { message: "Email is required" });
        else if (password.trim() === "")
            return responseObject(400, { message: "Password is required" });

        return await UsersAuthService.loginUser({email, password});
    }
    return responseObject(400, {message: "Body is required"});
};
