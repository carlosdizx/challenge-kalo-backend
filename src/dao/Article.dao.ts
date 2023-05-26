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

    public static findAllByUserId = async (userId: string) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(Article);
        return await repository.find({ where: { user: { id: userId } } });
    }

    public static deleteAllByUserId = async (userId: string) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(Article);
        const articles = await this.findAllByUserId(userId);
        for (const article of articles) {
            await repository.remove(article);
        }
        return true;
    }
}
