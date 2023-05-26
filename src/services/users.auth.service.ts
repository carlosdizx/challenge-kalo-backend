import User from "../entities/User.entity";
import responseObject from "../utils/Response";
import {generateToken} from '../utils/AuthUtils';
import {validatePassword} from '../utils/bcryptUtils';
import UserDao from "../dao/User.dao";
import UserCrudService from "./user.crud.service";

export default class UsersAuthService {
    public static registerUser = async ({name, email, password}: {name: string, email: string, password: string}) => {
        try {
            const result = await UserCrudService.create(name, email, password);
            if (result.statusCode === 200) {
                const user: User = JSON.parse(result.body);
                const userPlainObject = {
                    id: user.id,
                    email: user.email,
                    type: user.type
                };
                const token = await generateToken(userPlainObject);
                return responseObject(200, {email: user.email, token});
            }else
                return responseObject(result.statusCode, JSON.parse(result.body));
        }
        catch (e) {
            return responseObject(500, {
                message: "Error generating token",
                error: e,
            })
        }
    }

    public static loginUser = async ({email, password}: {email: string, password: string}) => {
        const userFound = await UserDao.findByEmail(email);
        if(userFound){
            const passwordIsValid = await validatePassword(password,userFound.password);
            if(!passwordIsValid)
                return responseObject(401, {message: "Password is incorrect."});

            const userPlainObject = {
                id: userFound.id,
                email: userFound.email,
                type: userFound.type
            };
            const token = await generateToken(userPlainObject);
            return responseObject(200, {email: userFound.email, token});
        }
        return responseObject(404, {message: "User not found!"});
    }
}
