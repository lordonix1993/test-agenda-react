import axios from "axios";
import { config_main } from "../config/main";

export const http = axios.create({
    baseURL: `${config_main.api_url}`,
});

const headers = {
    /*'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    'Content-Type': 'application/json',
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"*/
}

http.interceptors.request.use(
    function (config) {
        config.headers = headers
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);
