import getConnect from "../utils/DatabaseConnection";
import Article from "../entities/Article.entity";

export default class ArticleDao {

    public static create = async (title: string,  body: string, image: any) => {
        const datasource = await getConnect();
        const repository = datasource.getRepository(Article);
        const article = repository.create({ title, body, image });
        return await repository.save(article);
    }
}
