/**
 * Created by YuYoung on 2023/3/21
 * Description: 网络请求
 */

import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') === null ? '' : localStorage.getItem('token');
        config.headers.Authorization = 'Bearer ' + token;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
