import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";
import ArticlesCrudService from "../../services/articles.crud.service";
const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

const originalHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    if(event.body){
        const data = event.body.split("\r\n");
        const fileName = data[1].split(";")[2].split("=")[1].replace(/^"|"$/g, '').trim();
        const fileContent = data[4].trim();
        return responseObject(200, {message: 'Form data is required', fileName,fileContent});
    }
    return responseObject(200, {message: 'Form data is required'});
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER, TypesUser.ADMIN]))
    .handler(originalHandler);
