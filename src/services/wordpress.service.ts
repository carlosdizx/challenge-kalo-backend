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

    public static createPost = async (title: string, body: string, author: string) => {
        const token = await WordpressService.generateJWT();
        const {data} = await axiosInstance.post('wp/v2/posts', {
            title,
            content: `<h3>${author}</h3>
                      <br/>
                      <p>${body}</p>`,
            status: "publish"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    }

    public static updatePost = async (idWordPress: number,title: string, body: string, imageUrl: string) => {
        const token = await WordpressService.generateJWT();
        const html = `<img src="${imageUrl}" alt="Imagen caducada" /><hr/>
                            <p>${body}</p>`
        const {data} = await axiosInstance.post(`wp/v2/posts/${idWordPress}`, {
            title,
            content: html,
            status: "publish"
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return data;
    }
}
