import User from "../entities/User.entity";
import getConnect from "../utils/DatabaseConnection";
import {TypesUser} from "../enums/typesUser";

export default class UserDao {

    public static create = async (name: string, email: string, password: string, type: TypesUser) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(User);
        const user = repository.create({ name, email, password, type });
        return await repository.save(user);
    }

    public static findByEmail = async (email: string) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(User);
        return await repository.findOne({ where: { email } });
    }

    public static findById = async (id: string) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(User);
        return await repository.findOne({ where: { id } });
    }

    public static findAll = async ()=>{
        const datasource = await getConnect();
        const repository = datasource.getRepository(User);
        return repository.find();
    }

    public static update = async (name: string, email: string, password: string, id: string,) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(User);
        const user = await this.findById(id);
        const userEmail = await this.findByEmail(email);

        if (userEmail && userEmail.id !== user.id)
            return null;
        user.name = name;
        user.email = email;
        user.password = password;
        return await repository.save(user);
    }

    public static deleteUserAndArticles = async (userId: string) => {
        const datasource = await getConnect();
        const userRepository = datasource.getRepository(User);
        const deleteResult = await userRepository.delete(userId);
        return deleteResult.affected !== 0;
    }

}
