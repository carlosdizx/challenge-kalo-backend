import axios, { AxiosInstance  } from 'axios';
const URL = process.env.URL_WORDPRESS;
const axiosInstance: AxiosInstance = axios.create({
    baseURL: URL
});

export default axiosInstance;
