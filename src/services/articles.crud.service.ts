import ArticleDao from "../dao/Article.dao";
import responseObject from "../utils/Response";

export default class ArticlesCrudService {
    public static createArticle = async ({title, body, image}:{title: string,  body: string, image: any}) => {
        const article = await ArticleDao.create(title, body, image);
        return responseObject(200, article);
    }
}
