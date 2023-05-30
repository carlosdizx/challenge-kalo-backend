import responseObject from "../utils/Response";
import {getUser} from "../utils/AuthUtils";
import {TypesUser} from "../enums/typesUser";
import UserCrudService from "../services/user.crud.service";
const hasTokenValid = (roles: TypesUser[]) => {
    return {
        before: async (handler) => {
            console.log('MIDDLEWARE: Starting hasTokenValid method');
            handler.context.callbackWaitsForEmptyEventLoop = false;

            const headers = handler.event.headers;
            const {authorization} = headers;
            const token = authorization && authorization.split(" ")[1];
            if(token){
                const user =  await getUser(token);
                if(!user)
                    return responseObject(409, {message: 'JWT is invalid or expired'});
                const resultUser = await UserCrudService.findUserById(user.id);
                if(resultUser.statusCode !== 200)
                    return responseObject(resultUser.statusCode, {message: 'Your token is invalid or your id is not present in database'});

                if(roles.length > 0){
                    const roleFindIsValid = roles.includes(user.type);
                    if(!roleFindIsValid)
                        return responseObject(409, {message: "Your rol is not allowed to access this!"});
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
