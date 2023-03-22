/**
 * Created by YuYoung on 2023/3/21
 * Description: 网络请求
 */

import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8081",
    // timeout: 1000,
    // headers: {'X-Custom-Header': 'foobar'}
});

