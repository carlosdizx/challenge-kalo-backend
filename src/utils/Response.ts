interface Response {
    statusCode: number;
    body: string;
    headers: object;
}

const responseObject = (code: number, body: any, headers: object = {
    'Content-Type':'application/json'
}) : Response => ({statusCode: code, body: JSON.stringify(body), headers});

export default responseObject;
