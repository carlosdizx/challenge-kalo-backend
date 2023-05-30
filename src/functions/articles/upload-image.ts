import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../enums/typesUser";
import ArticlesCrudService from "../../services/articles.crud.service";
import {getUserId} from "../../utils/AuthUtils";
const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

const originalHandler  = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);
    if(event.body){
        const token = event.headers.authorization.split(" ")[1];
        const userId = getUserId(token);
        if(!userId)
            return responseObject(409, {message: 'JWT token no contain user id!'});

        const {id: articleId} = event.pathParameters;
        const data = event.body.split("\r\n");
        const fileContType = data[2].split(":")[1].trim();
        if(!allowedMimes.includes(fileContType))
            return responseObject(400, {message: "File is not a image!"});
        const fileName = data[1].split(";")[2].split("=")[1].replace(/^"|"$/g, '').trim();
        let fileContent = data[4];
        if(data.length === 12)
            fileContent = fileContent.concat(data[5], data[6], data[7], data[8], data[9], data[10], data[11]);
        const buffer = Buffer.from(fileContent, 'binary');
        return await ArticlesCrudService.uploadFileByArticle({image: buffer, name: fileName, type: fileContType}, articleId, userId);
    }
    return responseObject(400, {message: 'Form data is required'});
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER]))
    .handler(originalHandler);
