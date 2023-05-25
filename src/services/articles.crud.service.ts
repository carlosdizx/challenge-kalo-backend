import {upload} from "../utils/S3Config";
import responseObject from "../utils/Response";
import ArticleDao from "../dao/Article.dao";
import UserDao from "../dao/User.dao";

export default class ArticlesCrudService {

    public static createArticle = async ({title, body}:{title: string, body: string}, userId: string) =>{
        const user = await UserDao.findById(userId);
        if(!user)
            return responseObject(409, {message: "You do not have permission!"});
        try {
            const article = ArticleDao.create(title, body, user);
            return responseObject(200, {message: "Article created"});
        }
        catch (e) {
            return responseObject(500, {message: "Article creation error,", e})
        }
    }
    public static uploadFileByArticle = async (
        {image, name, type}:{image: Buffer, name: string, type: string}, articleId: string, userId: string
    ) => {
        const Key = `${userId}/${articleId}-${name}`;
        try {
            const result = await upload({Key, Body: image, ContentType: type});
            return responseObject(200, result);
        }
        catch (e) {
            return responseObject(500, "Error uploading image!");
        }
    }
}
