import getConnect from "../utils/DatabaseConnection";
import Article from "../entities/Article.entity";
import User from "../entities/User.entity";

export default class ArticleDao {

    public static create = async (title: string,  body: string, user: User) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(Article);
        const article = repository.create({ title, body });
        return await repository.save(article);
    }
}
