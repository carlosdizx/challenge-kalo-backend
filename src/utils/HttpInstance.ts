import axios, { AxiosInstance  } from 'axios';
const baseURL = process.env.URL_WORDPRESS;
const axiosInstance: AxiosInstance = axios.create({
    baseURL
});

export default axiosInstance;
