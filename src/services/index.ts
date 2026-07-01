import axios, {
    AxiosRequestConfig,
    AxiosRequestHeaders,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import { io, Socket } from 'socket.io-client';
import { hideLoader, showLoader } from '../redux/slice/screenSlice';
import { store } from '../redux/store';

export const BASE_URL = 'http://13.60.8.217:8000';
// export const BASE_URL = 'http://10.0.2.2:8000';

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,

    transformResponse: [
        (data) => {
            if (!data || /^\s*null\s*$/i.test(data)) return null;
            try {
                return JSON.parse(data);
            } catch {
                return data; // return raw if invalid JSON
            }
        },
    ],
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = store.getState()?.role?.userAuthToken;
        const lang = store.getState().role.languageSelect;
        console.log("Token in thw API helper", token);
        store.dispatch(showLoader('loading'));

        config.headers.set('x-app-language', lang);
        if (token) {
            (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        store.dispatch(hideLoader('idle'));
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (response: AxiosResponse) => {
        store.dispatch(hideLoader('idle'));
        return response;
    },
    error => {
        store.dispatch(hideLoader('idle'));
        console.log('API Error:', error.response?.data || error.message);
        return Promise.reject(
            error.response?.data?.message ||
            'Something went wrong. Please try again.',
        );
    },
);

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiResponse<T = any> {
    // json(): unknown;
    error: string | null;
    response: AxiosResponse<T> | null;
}

export const apiHelper = async <T = any>(
    method: HttpMethod,
    endPoint: string,
    params: Record<string, any> = {},
    customHeaders: Record<string, string> = {},
    body: any = null,
): Promise<ApiResponse<T>> => {

    try {
        const config: AxiosRequestConfig = {
            method,
            url: endPoint,
            headers: {
                'Content-Type': 'application/json',
                ...customHeaders,
            },
            ...(params && Object.keys(params).length > 0 && { params }),
            ...(method !== 'GET' && { data: body }),
        };

        const response = await instance.request<T>(config);

        return {
            error: null,
            response,
        };
    } catch (error: any) {
        return {
            error: error,
            response: null,
        };
    }
};
