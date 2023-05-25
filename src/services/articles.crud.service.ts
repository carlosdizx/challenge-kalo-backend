import {upload} from "../utils/S3Config";
import responseObject from "../utils/Response";

export default class ArticlesCrudService {
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
