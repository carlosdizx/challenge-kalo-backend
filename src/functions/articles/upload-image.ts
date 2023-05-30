import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../enums/typesUser";
import ArticlesCrudService from "../../services/articles.crud.service";
import {getUserId} from "../../utils/AuthUtils";
const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

const originalHandler:APIGatewayProxyHandler  = async (event, context) => {
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
        console.error("******************");
        console.log(data[0]);
        console.log(data[4]);
        console.error("******************");
        const fileName = data[1].split(";")[2].split("=")[1].replace(/^"|"$/g, '').trim();
        const fileContent = data[4];
        const buffer = Buffer.from(fileContent, 'binary');
        return await ArticlesCrudService.uploadFileByArticle({image: buffer, name: fileName, type: fileContType}, articleId, userId);
    }
    return responseObject(400, {message: 'Form data is required'});
};

export const handler = middy()
    .use(hasTokenValid([TypesUser.USER]))
    .handler(originalHandler);
