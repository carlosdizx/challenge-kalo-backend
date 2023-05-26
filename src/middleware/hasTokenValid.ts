import responseObject from "../utils/Response";
import {verifyToken} from "../utils/AuthUtils";
import {TypesUser} from "../Enums/typesUser";
import UserCrudService from "../services/user.crud.service";
const hasTokenValid = (roles: TypesUser[]) => {
    return {
        before: async (handler) => {
            console.log('MIDDLEWARE: Starting hasTokenValid method');
            handler.context.callbackWaitsForEmptyEventLoop = false;
            const headers = handler.event.headers;
            const {Authorization} = headers;
            const token = Authorization && Authorization.split(" ")[1];
            if(token){
                try {
                    const valid: any = verifyToken(token);
                    if(roles.length > 0){
                        const roleIsValid = roles.includes(valid.type);
                        if(!roleIsValid)
                            return responseObject(409, {message: "Your rol is not allowed to access this!"});
                    }
                    const userId = handler.event.requestContext.authorizer.claims.id;
                    const user = await UserCrudService.findUserById(userId);
                    if(!user)
                        return responseObject(403, {message: "Your token is valid, but your id not found!"});
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
