import {getFileUrl, upload} from "../utils/S3Config";
import responseObject from "../utils/Response";
import ArticleDao from "../dao/Article.dao";
import UserDao from "../dao/User.dao";
import WordpressService from "./wordpress.service";

export default class ArticlesCrudService {

    public static createArticle = async ({title, body}:{title: string, body: string}, userId: string) =>{
        const user = await UserDao.findById(userId);
        if(!user)
            return responseObject(409, {message: "You do not have permission!"});
        try {
            const {id: idWordPress} = await WordpressService.createPost(title, body, user.name);
            const article = await ArticleDao.create(title, body, user, idWordPress);
            return responseObject(200, {message: "Article created", article: article.id, idWordPress});
        }
        catch (e) {
            return responseObject(500, {message: "Article creation error,", e})
        }
    }
    public static uploadFileByArticle = async (
        {image, type}:{image: Buffer, type: string}, articleId: string, userId: string
    ) => {
        const article = await ArticleDao.findById(articleId);
        if(!article) return responseObject(409, {message: "The article does not exist!"});
        const Key = `${userId}/${articleId}`;
        try {
            await upload({Key, Body: image, ContentType: type});
            const urlImage = await this.getUrlImage(Key);
            await WordpressService.updatePost(article.idWordPress, article.title, article.body, urlImage);
            return responseObject(200, {message: "Image upload correctly!"});
        }
        catch (e) {
            console.log(e);
            return responseObject(500, "Error uploading image!");
        }
    }

    private static getUrlImage = async (key: string) => {
        try {
            return await getFileUrl(key);
        }
        catch (e) {
            return undefined;
        }
    }

    public static findArticleById = async (articleId: string, key: string) => {
        const article = await ArticleDao.findById(articleId);
        if(!article) return responseObject(409, {message: "The article does not exist!"});
        const image = await ArticlesCrudService.getUrlImage(key);
        return responseObject(200, {...article, image});
    }

    public static findAllArticles = async (userId: string) => {
        const articles = await ArticleDao.findAllByUserId(userId);
        const articlesMap: any[] = [];

        for (const article of articles) {
            const key = `${userId}/${article.id}`;
            const image = await ArticlesCrudService.getUrlImage(key);
            articlesMap.push({...article, image})
        }

        return responseObject(200, articlesMap);
    }
}
