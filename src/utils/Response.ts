import {Response} from 'lambda-proxy-utils';

const parser = (statusCode: number, data?: any, headers: object = {
    "Content-Type":"application/json"
}) => {
    data = data || {};
    return new Response({statusCode, cors: true, headers}).send(JSON.stringify(data));
}

const responseObject = (code: number, body: any, headers: object = {
    'Content-Type':'application/json'
}) : Response => parser(code, body, headers);

export default responseObject;
