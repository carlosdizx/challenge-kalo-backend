import responseObject from "../utils/Response";
import {verifyToken} from "../utils/AuthUtils";
import {TypesUser} from "../enums/typesUser";
const hasTokenValid = (roles: TypesUser[]) => {
    return {
        before: async (handler) => {
            console.log('MIDDLEWARE: Starting hasTokenValid method');
            handler.context.callbackWaitsForEmptyEventLoop = false;

            const headers = handler.event.headers;
            const {authorization} = headers;
            const token = authorization && authorization.split(" ")[1];
            if(token){
                try {
                    const valid: any = verifyToken(token);
                    if(roles.length > 0){
                        const roleFindIsValid = roles.includes(valid.type);
                        if(!roleFindIsValid)
                            return responseObject(409, {message: "Your rol is not allowed to access this!"});
                    }
                }
                catch (err) {
                    return responseObject(409, {message: "Your token is invalid!"});
                }
            }else
                return responseObject(403, {message: "You are not allowed to access this!"});
        },
        onError: async (handler) => {
            console.log('onError: ', handler.error);
            const e = responseObject(401, handler.error);
            return handler.callback(null, e);
        },
    }
}

export default hasTokenValid;
