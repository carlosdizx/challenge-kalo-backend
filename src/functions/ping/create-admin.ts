import responseObject from "../../utils/Response";
import middy from "@middy/core";
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser'
import UserCrudService from "../../services/user.crud.service";
import {TypesUser} from "../../enums/typesUser";

const originalHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    try {
        if (!event.body)
            return responseObject(400, {message: 'Data user is required'});
        const {name, email, password} = event.body;

        if (!name || name.trim() === "")
            return responseObject(400, { message: "Name is required" });
        else if (!email || email.trim() === "")
            return responseObject(400, { message: "Email is required" });
        else if (!password || password.trim() === "")
            return responseObject(400, { message: "Password is required" });

        return await UserCrudService.create(name, email, password, TypesUser.ADMIN);
    }
    catch (e) {
        return responseObject(500, {message: 'Failed to establish a database connection.'})
    }
};

export const handler = middy()
    .use(httpHeaderNormalizer())
    .use(httpJsonBodyParser())
    .handler(originalHandler);
