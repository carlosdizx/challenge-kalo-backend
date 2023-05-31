import axiosInstance from "../utils/HttpInstance";

export default class WordpressService {
    public static authenticated = async () => {
        const username = process.env.JWT_AUTH_USER;
        const password = process.env.JWT_AUTH_PASSWORD;
        const {data} = await axiosInstance.post(`jwt-auth/v1token?${username}&password=${password}`);
        return data.token;
    }
}
