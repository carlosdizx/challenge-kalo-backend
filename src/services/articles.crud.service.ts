import {upload} from "../utils/S3Config";

export default class ArticlesCrudService {
    public static createArticle = async ({title, body, image}:{title: string,  body: string, image: any}) => {
        const {content, mimetype, filename} = image;
        return await upload({Key: `${title}-${filename}`, Body: content, ContentType: mimetype});
    }
}
