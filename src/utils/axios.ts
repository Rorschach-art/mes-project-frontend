// src/utils/axios.ts
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { ElMessage } from "element-plus";
import axiosRetry from 'axios-retry';

/**
 * 配置接口，用于初始化 Axios 实例。
 */
interface AxiosConfig {
  // 基础 URL，默认为环境变量中的 VITE_API_BASE_URL
  baseURL?: string;
  // 请求超时时间，默认为 15000 毫秒
  timeout?: number;
  // 获取 token 的函数，返回字符串或 null
  getToken?: () => string | null;
  // 错误处理函数，接收错误消息作为参数
  onError?: (message: string) => void;
}

/**
 * 错误信息映射表，将 HTTP 状态码映射到对应的错误消息。
 */
const errorMessages: Record<number, string> = {
  401: "未授权，请重新登录",
  403: "拒绝访问",
  404: "请求资源未找到",
  500: "服务器内部错误",
};

/**
 * Axios 单例类，用于创建和管理 Axios 实例。
 */
class AxiosSingleton {
  // 单例实例
  private static instance: AxiosSingleton | null = null;
  // Axios 实例
  private axiosInstance: AxiosInstance;

  /**
   * 构造函数，初始化 Axios 实例和拦截器。
   * @param config - Axios 配置对象
   */
  private constructor(config: AxiosConfig = {}) {
    // 创建 Axios 实例
    this.axiosInstance = axios.create({
      // 设置基础 URL，默认为环境变量中的 VITE_API_BASE_URL
      baseURL: config.baseURL || import.meta.env.VITE_API_BASE_URL,
      // 设置请求超时时间，默认为 15000 毫秒
      timeout: config.timeout || 15000,
    });

  // 配置重试
  axiosRetry(this.axiosInstance, {
    retries: 3, // 重试次数
    retryDelay: axiosRetry.exponentialDelay, // 指数退避
    retryCondition: (error) => {
      // 仅对特定错误重试
      return axiosRetry.isNetworkError(error) ||
             axiosRetry.isRetryableError(error) ||
             error.response?.status === 429;
    }
  });

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (reqConfig: InternalAxiosRequestConfig) => {
        // 获取 token，优先使用配置中的 getToken 函数，否则从本地存储中获取
        const token = config.getToken ? config.getToken() : localStorage.getItem("token");
        if (token) {
          // 在请求头中设置 Authorization
          reqConfig.headers.set("Authorization", `Bearer ${token}`);
        }
        return reqConfig;
      },
      (error: AxiosError) => {
        // 定义错误消息
        const message = "请求发送失败";
        // 确保条件表达式有明确的副作用
        if (config.onError) {
          // 调用配置中的错误处理函数
          config.onError(message);
        } else {
          // 使用 ElementPlus 的消息提示组件显示错误消息
          ElMessage.error(message);
        }
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => {
        // 定义错误消息
        let message = "请求发送失败";
        if (error.response) {
          // 获取响应状态码
          const status = error.response.status;
          // 根据状态码从错误信息映射表中获取错误消息
          message = errorMessages[status] || "未知错误";
        }
        // 确保条件表达式有明确的副作用
        if (config.onError) {
          // 调用配置中的错误处理函数
          config.onError(message);
        } else {
          // 使用 ElementPlus 的消息提示组件显示错误消息
          ElMessage.error(message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取单例实例，如果实例不存在或提供了新的配置，则创建一个新的实例。
   * @param config - Axios 配置对象
   * @returns AxiosSingleton 实例
   */
  public static getInstance(config?: AxiosConfig): AxiosSingleton {
    if (!AxiosSingleton.instance || config) {
      AxiosSingleton.instance = new AxiosSingleton(config);
    }
    return AxiosSingleton.instance;
  }

  /**
   * 创建一个新的 AxiosSingleton 实例。
   * @param config - Axios 配置对象
   * @returns AxiosSingleton 实例
   */
  public static createInstance(config: AxiosConfig): AxiosSingleton {
    return new AxiosSingleton(config);
  }

  /**
   * 发送 GET 请求。
   * @param url - 请求的 URL
   * @param config - Axios 请求配置
   * @returns Promise 对象，包含响应数据
   */
  public get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.get<T>(url, config);
  }

  /**
   * 发送 POST 请求。
   * @param url - 请求的 URL
   * @param data - 请求的数据
   * @param config - Axios 请求配置
   * @returns Promise 对象，包含响应数据
   */
  public post<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.post<T>(url, data, config);
  }

  /**
   * 发送 PUT 请求。
   * @param url - 请求的 URL
   * @param data - 请求的数据
   * @param config - Axios 请求配置
   * @returns Promise 对象，包含响应数据
   */
  public put<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.put<T>(url, data, config);
  }

  /**
   * 发送 DELETE 请求。
   * @param url - 请求的 URL
   * @param config - Axios 请求配置
   * @returns Promise 对象，包含响应数据
   */
  public delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return this.axiosInstance.delete<T>(url, config);
  }

  /**
   * 发送 PATCH 请求。
   * @param url - 请求的 URL
   * @param data - 请求的数据
   * @param config - Axios 请求配置
   * @returns Promise 对象，包含响应数据
   */
  public patch<T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.patch<T>(url, data, config);
  }
}

/**
 * 单例模式，返回 AxiosSingleton 实例。
 * @param config - Axios 配置对象
 * @returns AxiosSingleton 实例
 */
export const AxiosSingle = (config?: AxiosConfig) => {
  return AxiosSingleton.getInstance(config);
};

/**
 * 工厂模式，创建并返回一个新的 AxiosSingleton 实例。
 * @param config - Axios 配置对象
 * @returns AxiosSingleton 实例
 */
export const createAxios = (config: AxiosConfig) => {
  return AxiosSingleton.createInstance(config);
};
