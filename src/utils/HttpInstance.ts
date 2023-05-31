import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: 'https://ernestodiaz.000webhostapp.com/wp-json/'
});

export default axiosInstance;
