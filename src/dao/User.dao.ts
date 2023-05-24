import User from "../entities/User.entity";
import getConnect from "../utils/DatabaseConnection";
import {TypesUser} from "../Enums/typesUser";

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
}
