import User from "../entities/User.entity";
import responseObject from "../utils/Response";
import {generateToken} from '../utils/AuthUtils';
import {encryptPassword, validatePassword} from '../utils/bcryptUtils';
import UserDao from "../dao/User.dao";
import {TypesUser} from "../Enums/typesUser";

export default class UsersAuthService {
    public static create = async (name: string, email: string, password: string, type: TypesUser = TypesUser.USER) => {
        const hashedPassword = await encryptPassword(password);
        try {
            const result = await UserDao.create(name, email, hashedPassword, type);
            return responseObject(200, result);
        }
        catch (e) {
            return responseObject(500, {
                message: "Error creating user",
                error: e,
            });
        }
    }

    public static registerUser = async ({name, email, password, type}: {name: string, email: string, password: string, type: TypesUser}) => {
        try {
            const result = await this.create(name, email, password, type);
            if (result.statusCode === 200) {
                const user: User = JSON.parse(result.body);
                const token = await generateToken(user);
                return responseObject(200, {email: user.email, token});
            }else
                return responseObject(500, result.body);
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
                name: userFound.name,
                email: userFound.email
            };

            const token = await generateToken(userPlainObject);
            return responseObject(200, {email: userFound.email, token});
        }
        return responseObject(404, {message: "User not found!"});
    }
}
