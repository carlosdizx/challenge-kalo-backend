import axiosInstance from "../utils/HttpInstance";
const username = process.env.JWT_AUTH_USER;
const password = process.env.JWT_AUTH_PASSWORD;
export default class WordpressService {
    private static generateJWT = async () => {
        const {data} = await axiosInstance.post('jwt-auth/v1/token', {
            username,
            password
        });
        return data.token;
    }

    public static createPost = async (title: string, body: string) => {
        const token = await WordpressService.generateJWT();
        const {data} = await axiosInstance.post('wp/v2/posts', {
            title,
            content: `<p>${body}</p>`,
            status: "publish"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    }
}
