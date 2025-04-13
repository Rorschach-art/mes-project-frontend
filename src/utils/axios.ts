// 导入必要的依赖
import axios, {
  type AxiosInstance,        // Axios实例类型
  type AxiosRequestConfig,   // Axios请求配置类型
  type AxiosResponse,        // Axios响应类型
  type AxiosError,           // Axios错误类型
  type InternalAxiosRequestConfig,  // 内部Axios请求配置类型
} from "axios";
import { ElMessage } from "element-plus";  // Element Plus的消息提示组件
import axiosRetry from "axios-retry";      // Axios重试插件
import { useAuthStore } from "../stores/counter";  // Pinia认证存储

// 默认配置常量
const DEFAULT_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api",  // 基础API地址
  TIMEOUT: 15000,          // 请求超时时间(毫秒)
  RETRY_COUNT: 3,          // 重试次数
  MIN_REQUEST_INTERVAL: 1000,  // 最小请求间隔(毫秒)
};

// 类型定义
type RequestStatus = 'pending' | 'success' | 'error';  // 请求状态类型

// 错误详情接口
interface ErrorDetails {
  code?: string;                   // 错误代码
  message?: string;                // 错误消息
  target?: string;                 // 错误目标
  details?: Record<string, string[]>;  // 详细错误信息
  innerError?: ErrorDetails;       // 内部错误
  timestamp?: Date;                // 时间戳
  source?: string;                 // 错误来源
  helpLink?: string;               // 帮助链接
}

// 格式化响应接口
export interface FormattedResponse<T = unknown> {
  isSuccess: boolean;             // 是否成功
  message: string;                // 响应消息
  data: T;                        // 响应数据
  responseCode: number | null;    // 响应代码
  errorInfo: ErrorDetails | null; // 错误信息
}

// 自定义Axios响应类型
type CustomAxiosResponse<T> = AxiosResponse<FormattedResponse<T>>;

// Axios配置接口
interface AxiosConfig {
  baseURL?: string;                // 基础URL
  timeout?: number;               // 超时时间
  getToken?: () => string | null;  // 获取token的函数
  onError?: (message: string) => void;  // 错误处理回调
  minRequestInterval?: number;     // 最小请求间隔
}

// HTTP状态码对应的错误消息映射
const errorMessages: Record<number, string> = {
  400: "请求参数错误",
  401: "登录状态已过期，请重新登录",
  403: "拒绝访问",
  404: "请求资源未找到",
  405: "请求方法不允许",
  408: "请求超时",
  429: "请求过于频繁",
  500: "服务器内部错误",
  502: "网关错误",
  503: "服务不可用",
  504: "网关超时",
};

// 请求节流控制器类
class RequestThrottle {
  private lastRequestTime = 0;      // 上次请求时间
  private pendingRequests: Array<() => void> = [];  // 待处理请求队列

  constructor(private readonly interval: number) {}  // 构造器，接收间隔时间

  // 执行请求(带节流)
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    const delay = this.interval - (now - this.lastRequestTime);

    if (delay > 0) {
      return new Promise((resolve, reject) => {
        this.pendingRequests.push(() => {
          fn().then(resolve).catch(reject);
        });
        setTimeout(() => this.processNext(), delay);
      });
    }

    this.lastRequestTime = now;
    return fn();
  }

  // 处理下一个请求
  private processNext() {
    const next = this.pendingRequests.shift();
    if (next) {
      this.lastRequestTime = Date.now();
      next();
    }
  }
}

// Axios单例类
class AxiosSingleton {
  private static instance: AxiosSingleton;  // 单例实例
  private axiosInstance: AxiosInstance;    // Axios实例
  private requestThrottle: RequestThrottle; // 请求节流控制器

  private constructor(config: AxiosConfig = {}) {
    // 创建Axios实例
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || DEFAULT_CONFIG.BASE_URL,
      timeout: config.timeout || DEFAULT_CONFIG.TIMEOUT,
    });

    // 初始化请求节流控制器
    this.requestThrottle = new RequestThrottle(
      config.minRequestInterval || DEFAULT_CONFIG.MIN_REQUEST_INTERVAL
    );

    // 设置拦截器
    this.setupInterceptors(config);
    // 配置重试
    this.configureRetry();
  }

  // 获取认证存储
  private getAuthStore() {
    try {
      return useAuthStore();
    } catch (error) {
      console.error('Auth store not available:', error);
      return null;
    }
  }

  // 设置拦截器
  private setupInterceptors(config: AxiosConfig) {
    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (reqConfig: InternalAxiosRequestConfig) => {
        const authStore = this.getAuthStore();
        const token = authStore?.token || config.getToken?.();
        if (token && token !== ""&& typeof token!== null && typeof token!== undefined && reqConfig.headers) {
          reqConfig.headers.Authorization = `Bearer ${token}`;
        }
        console.log('reqConfig', reqConfig);
        return reqConfig;
      },
      (error: AxiosError) => this.handleError(error, config)
    );

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: CustomAxiosResponse<unknown>) => this.handleResponse(response),
      (error: AxiosError) => this.handleError(error, config)
    );
  }

  // 配置重试
  private configureRetry() {
    axiosRetry(this.axiosInstance, {
      retries: DEFAULT_CONFIG.RETRY_COUNT,  // 重试次数
      retryDelay: axiosRetry.exponentialDelay,  // 指数退避延迟
      retryCondition: (error) =>  // 重试条件
        axiosRetry.isNetworkError(error) ||  // 网络错误
        axiosRetry.isRetryableError(error) ||  // 可重试错误
        error.response?.status === 429,  // 429状态码(请求过多)
    });
  }

  // 处理响应
  private handleResponse<T>(response: CustomAxiosResponse<T>) {
    const { data } = response;

    if (!data || typeof data !== "object") {
      throw new Error("无效的响应格式");
    }

    if (!data.isSuccess) {
      if (data.message) {
        ElMessage.error(data.message);
      }
      throw data.errorInfo ? data.errorInfo : new Error("请求失败");
    }

    return response;
  }

  // 处理错误
  private async  handleError(error: AxiosError, config: AxiosConfig) {
    const authStore = this.getAuthStore();
    const originalRequest = error.config;
    // 401处理(未授权)
    if (error.response?.status === 401) {
      //等待两秒后执行刷新token
      await new Promise(resolve => setTimeout(resolve, 2000));
      const refreshToken = authStore?.refreshToken || '';
      console.log('authStore', authStore);
      console.log('refreshToken', refreshToken);
      if (refreshToken && originalRequest ) {
        try {
          const refreshClient = axios.create({
            baseURL: config.baseURL || DEFAULT_CONFIG.BASE_URL,
            headers: {
              'Authorization': `Bearer ${refreshToken}` // 使用refreshToken作为请求头
            }
          });
          const response = await refreshClient.post('User/RefreshToken', {
            refreshToken
          });
          console.log('response', response);
          if (authStore) {
            authStore.login(response.data.data.accessToken, response.data.data.refreshToken
            );
          }
          console.log('response', response);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;
          }
          debugger
          // 重新发起原始请求
          return this.axiosInstance(originalRequest);
        } catch (refreshError) {
     // 刷新token失败，执行登出
     authStore?.logout();
     window.location.replace('/LoginView');
     ElMessage.error('登录已过期，请重新登录');
     return Promise.reject(refreshError);
   }
 } else {
   // 没有refreshToken或刷新失败，执行登出
   authStore?.logout();
   window.location.replace('/LoginView');
   ElMessage.error('登录已过期，请重新登录');
   return Promise.reject(error);
 }
}

    const message = this.getErrorMessage(error);
    if (config.onError) {
      config.onError(message);
    } else {
      ElMessage.error(message);
    }

    // 增强错误对象
    const enhancedError = Object.assign(error, {
      isNetworkError: !error.response,
      isRateLimitError: error.response?.status === 429,
    });

    return Promise.reject(enhancedError);
  }

  // 获取错误消息
  private getErrorMessage(error: AxiosError): string {
    if (!error.response) {
      return "网络连接异常，请检查网络设置";
    }

    const status = error.response.status;
    return errorMessages[status] || `服务器错误 (${status})`;
  }

  // 获取单例实例
  public static getInstance(config?: AxiosConfig): AxiosSingleton {
    if (!AxiosSingleton.instance) {
      AxiosSingleton.instance = new AxiosSingleton(config);
    }
    return AxiosSingleton.instance;
  }

  // 创建新实例(工厂方法)
  public static createInstance(config: AxiosConfig): AxiosSingleton {
    return new AxiosSingleton(config);
  }

  // 发起请求
  public async request<T = unknown>(config: AxiosRequestConfig): Promise<FormattedResponse<T>> {
    return this.requestThrottle.execute(() =>
      this.axiosInstance.request<FormattedResponse<T>>(config)
    ).then(r => r.data);
  }

  // HTTP方法封装
  public get = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    this.request<T>({ ...config, method: 'GET', url });

  public post = <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    this.request<T>({ ...config, method: 'POST', url, data });

  public put = <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    this.request<T>({ ...config, method: 'PUT', url, data });

  public delete = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    this.request<T>({ ...config, method: 'DELETE', url });

  public patch = <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) =>
    this.request<T>({ ...config, method: 'PATCH', url, data });
}

// 导出单例实例
export const apiClient = AxiosSingleton.getInstance();
// 导出工厂方法
export const createAxios = (config: AxiosConfig) => AxiosSingleton.createInstance(config);
