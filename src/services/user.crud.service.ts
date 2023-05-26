import {TypesUser} from "../Enums/typesUser";
import {encryptPassword} from "../utils/bcryptUtils";
import UserDao from "../dao/User.dao";
import responseObject from "../utils/Response";

export default class UserCrudService {
    public static create = async (name: string, email: string, password: string, type: TypesUser = TypesUser.USER) => {
        const hashedPassword = await encryptPassword(password);
        const userFound = await UserDao.findByEmail(email);
        if(userFound)
            return responseObject(409, {message: "User already exists"});
        try {
            const user = await UserDao.create(name, email, hashedPassword, type);
            return responseObject(200, {message: "User created", email, id: user.id, type});
        }
        catch (e) {
            return responseObject(500, {message: "Error creating user"});
        }
    }

    public static findUserById = async (userId: string)=>
        await UserDao.findById(userId);
}
