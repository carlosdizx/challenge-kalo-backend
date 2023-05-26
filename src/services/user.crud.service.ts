import {TypesUser} from "../Enums/typesUser";
import {encryptPassword} from "../utils/bcryptUtils";
import UserDao from "../dao/User.dao";
import responseObject from "../utils/Response";
import User from "../entities/User.entity";

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
    {
        try {
            const user = await UserDao.findById(userId);
            if(user)
                return responseObject(200, {...user, password: undefined});
            return responseObject(404, {message: "User not found!"});
        }
        catch (e) {
            return responseObject(409, {message: `User not found, check your id is valid: ${userId}`});
        }
    }

    public static list = async () => {
        const users = await UserDao.findAll();
        const usersMap: any[] = [];
        for (const user of users) {
            usersMap.push({id: user.id, email: user.email});
        }
        return responseObject(200, usersMap);
    }

    public static update = async ({name, email, password}:{name: string, email: string, password: string},userId: string)=> {
        const response = await this.findUserById(userId);
        if(response.statusCode === 200){
            const user : User = JSON.parse(response.body);
            const hashedPassword = await encryptPassword(password);
            try {
                const result = await UserDao.update(name, email, hashedPassword, userId);
                if(result)
                    return responseObject(200, {message: "User updated", email: result.email, id: user.id, type: result.type});
                return responseObject(409, {message:"User not updated, email already in use"})
            }
            catch (e){
                responseObject(500, {message:"User not updated!"})
            }
        }
        else
            return response;
    }
}
