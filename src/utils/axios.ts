// src/utils/axios.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";

// 配置接口
interface AxiosConfig {
  baseURL?: string;
  timeout?: number;
  getToken?: () => string | null;
  onError?: (message: string) => void; // 移除 undefined，简化类型
}

// 错误信息映射表
const errorMessages: Record<number, string> = {
  401: "未授权，请重新登录",
  403: "拒绝访问",
  404: "请求资源未找到",
  500: "服务器内部错误",
};

class AxiosSingleton {
  private static instance: AxiosSingleton | null = null;
  private axiosInstance: AxiosInstance;

  private constructor(config: AxiosConfig = {}) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || import.meta.env.VITE_API_BASE_URL,
      timeout: config.timeout || 15000,
    });

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (reqConfig: InternalAxiosRequestConfig) => {
        const token = config.getToken ? config.getToken() : localStorage.getItem("token");
        if (token) {
          reqConfig.headers.set("Authorization", `Bearer ${token}`);
        }
        return reqConfig;
      },
      (error: AxiosError) => {
        const message = "请求发送失败";
        // 确保条件表达式有明确的副作用
        if (config.onError) {
          config.onError(message);
        } else {
          ElMessage.error(message);
        }
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => {
        let message = "请求发送失败";
        if (error.response) {
          const status = error.response.status;
          message = errorMessages[status] || "未知错误";
        }
        // 确保条件表达式有明确的副作用
        if (config.onError) {
          config.onError(message);
        } else {
          ElMessage.error(message);
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(config?: AxiosConfig): AxiosSingleton {
    if (!AxiosSingleton.instance || config) {
      AxiosSingleton.instance = new AxiosSingleton(config);
    }
    return AxiosSingleton.instance;
  }

  public static createInstance(config: AxiosConfig): AxiosSingleton {
    return new AxiosSingleton(config);
  }

  public get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete<T>(url, config);
  }

  public patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.patch<T>(url, data, config);
  }
}
//单例模式
export const AxiosSingle = (config?: AxiosConfig) => {
  return AxiosSingleton.getInstance(config);
};
//工厂模式
export const createAxios = (config: AxiosConfig) => {
  return AxiosSingleton.createInstance(config);
};
