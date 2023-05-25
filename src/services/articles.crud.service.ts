import {getFileUrl, upload} from "../utils/S3Config";
import responseObject from "../utils/Response";
import ArticleDao from "../dao/Article.dao";
import UserDao from "../dao/User.dao";

export default class ArticlesCrudService {

    public static createArticle = async ({title, body}:{title: string, body: string}, userId: string) =>{
        const user = await UserDao.findById(userId);
        if(!user)
            return responseObject(409, {message: "You do not have permission!"});
        try {
            const article = await ArticleDao.create(title, body, user);
            return responseObject(200, {message: "Article created", article: article.id});
        }
        catch (e) {
            return responseObject(500, {message: "Article creation error,", e})
        }
    }
    public static uploadFileByArticle = async (
        {image, name, type}:{image: Buffer, name: string, type: string}, articleId: string, userId: string
    ) => {
        const article = await ArticleDao.findById(articleId);
        if(!article) return responseObject(409, {message: "The article does not exist!"});
        const extension = name.split(".")[name.split(".").length -1];
        const Key = `${userId}/${articleId}.${extension}`;
        try {
            await upload({Key, Body: image, ContentType: type});
            return responseObject(200, {message: "Image upload correctly!"});
        }
        catch (e) {
            return responseObject(500, "Error uploading image!");
        }
    }

    private static getUrlImage = async (key: string) => {
        try {
            return await getFileUrl(key);
        }
        catch (e) {
            return null;
        }
    }

    public static findArticleById = async (articleId: string, key: string) => {
        const article = await ArticleDao.findById(articleId);
        if(!article) return responseObject(409, {message: "The article does not exist!"});
        return responseObject(200,article);
    }
}
