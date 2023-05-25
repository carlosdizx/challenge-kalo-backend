import getConnect from "../utils/DatabaseConnection";
import Article from "../entities/Article.entity";
import User from "../entities/User.entity";

export default class ArticleDao {

    public static create = async (title: string,  body: string, user: User) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(Article);
        const article = repository.create({ title, body, user });
        return await repository.save(article);
    }

    public static findById = async (id: string) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(Article);
        return await repository.findOne({ where: { id } });
    }
}
