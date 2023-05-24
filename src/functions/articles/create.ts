import {APIGatewayProxyHandler} from "aws-lambda";
import responseObject from "../../utils/Response";
import middy from "@middy/core";
import hasTokenValid from "../../middleware/hasTokenValid";
import {TypesUser} from "../../Enums/typesUser";
import multipartBodyParser from '@middy/http-multipart-body-parser';

const originalHandler = async (event, context) => {
    console.log(`HANDLER: Starting ${context.functionName}...`);

    if (event.body) {
        const {title, body, image} = event.body;

        console.log('title:', title);
        console.log('body:', body);
        console.log('image:', image);
        console.log('typeof image:', typeof image);

        return responseObject(200, { message: 'Form data processed successfully' });
    }

    return responseObject(400, { message: 'Form data is required' });
};

export const handler = middy()
    .use(multipartBodyParser())
    .use(hasTokenValid([TypesUser.USER, TypesUser.ADMIN]))
    .handler(originalHandler);
