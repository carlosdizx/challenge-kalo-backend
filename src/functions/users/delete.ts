import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../enums/typesUser";
import UserCrudService from "../../services/user.crud.service";

const originalHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    const {id} = event.pathParameters;
    return await UserCrudService.deleteById(id);
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.ADMIN]))
    .handler(originalHandler);
