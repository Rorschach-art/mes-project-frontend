# Axios封装说明文档

本文档详细描述了一个为MES系统设计的Axios封装实现，适用于Vue 3 + TypeScript项目。封装提供了统一的HTTP请求管理，支持Mock数据、文件操作、轮询功能以及健壮的错误处理和token刷新机制。

## 设计目标

- **统一性**：通过单一实例管理所有请求，集中配置和拦截逻辑。
- **实用性**：支持MES系统常见场景，如实时数据轮询、文件上传下载、权限管理。
- **可调试性**：开发环境支持Mock数据和日志，生产环境无缝切换真实请求。
- **健壮性**：处理错误、重试、token刷新，确保系统稳定性。
- **类型安全**：利用TypeScript提供类型提示，提升开发体验。

## 依赖

- `axios`：核心HTTP请求库。
- `axios-retry`：请求重试插件。
- `element-plus`：错误提示组件（可替换为其他UI库）。

###### 安装命令：

```bash
npm install axios axios-retry element-plus
```

## 完整代码

```typescript
// src/utils/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import axiosRetry from 'axios-retry'

// 环境配置
const API_BASE_URL = {
  development: 'http://localhost:3000/api',
  production: 'https://api.yourmes.com'
}

// 是否启用Mock（开发环境默认开启）
const ENABLE_MOCK = process.env.NODE_ENV === 'development' && true

// 定义响应数据类型
interface ResponseData<T = any> {
  code: number
  data: T
  message: string
}

// Mock数据
const mockData: Record<string, any> = {
  '/user/info': { id: 1, name: 'Test User', role: 'admin' },
  '/production/status': { id: 1, status: 'running', timestamp: Date.now() }
}

// Mock响应构造器
function createMockResponse<T>(data: T): Promise<AxiosResponse<ResponseData<T>>> {
  return Promise.resolve({
    data: { code: 200, data, message: 'Mock Success' },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as AxiosRequestConfig
  })
}

// 创建Axios实例
const request: AxiosInstance = axios.create({
  baseURL: API_BASE_URL[process.env.NODE_ENV as keyof typeof API_BASE_URL],
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// 添加重试机制
axiosRetry(request, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000
})

// Token刷新相关
let refreshPromise: Promise<string> | null = null
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
async function refreshToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = request
      .post<string>('/auth/refresh', { refreshToken: localStorage.getItem('refreshToken') })
      .then((newToken) => {
        localStorage.setItem('token', newToken)
        refreshPromise = null
        return newToken
      })
      .catch((err) => {
        refreshPromise = null
        ElMessage.error('刷新token失败，请重新登录')
        throw err
      })
  }
  return refreshPromise
}

// 请求拦截器
request.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    if (ENABLE_MOCK && mockData[config.url!]) {
      console.log(`[MOCK] 拦截请求: ${config.url}`)
      return createMockResponse(mockData[config.url!]) as any
    }
    let token = localStorage.getItem('token')
    if (token && isTokenExpired(token) && config.url !== '/auth/refresh') {
      token = await refreshToken()
    }
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.method === 'get') {
      config.params = { ...config.params, _t: Date.now() }
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${config.method?.toUpperCase()}] ${config.url}`, config.data || config.params)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const res = response.data
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || 'Error'))
    }
    return res.data
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('请求已取消:', error.message)
      return Promise.reject(error)
    }
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('登录过期，请重新登录')
          break
        case 404:
          ElMessage.error('资源不存在')
          break
        default:
          ElMessage.error('服务器错误')
      }
    } else {
      ElMessage.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

// 封装请求方法
const http = {
  get<T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, { params, ...config })
  },
  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config)
  },
  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config)
  },
  delete<T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, { params, ...config })
  },
  patch<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
    return request.patch(url, data, config)
  },
  upload<T = any>(url: string, file: File, data?: object): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    if (data) {
      Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)))
    }
    return request.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  download(url: string, params?: object): void {
    request
      .get(url, { params, responseType: 'blob' })
      .then((res) => {
        const blob = new Blob([res])
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = decodeURIComponent((res as any).headers['content-disposition']?.split('filename=')[1] || 'file')
        link.click()
        URL.revokeObjectURL(link.href)
      })
      .catch(() => ElMessage.error('下载失败'))
  },
  poll<T = any>(
    url: string,
    params: object,
    interval: number = 5000,
    callback: (data: T) => void
  ): () => void {
    let canceled = false
    const source = axios.CancelToken.source()
    const pollFn = async () => {
      while (!canceled) {
        try {
          const data = await request.get<T>(url, { params, cancelToken: source.token })
          callback(data)
        } catch (err) {
          if (!axios.isCancel(err)) console.error('轮询失败:', err)
          break
        }
        await new Promise((resolve) => setTimeout(resolve, interval))
      }
    }
    pollFn()
    return () => {
      canceled = true
      source.cancel('轮询已取消')
    }
  }
}

export default http
```

## 功能说明

### 1. 基础配置

* **API_BASE_URL**：根据环境（development/production）动态设置基地址。
* **Axios实例**：配置10秒超时，默认JSON请求头。
* **类型定义**：ResponseData<T>规范后端返回结构。

### 2. Mock拦截器

* **ENABLE_MOCK**：开发环境默认启用，可通过环境变量关闭。
* **mockData**：定义URL和对应的模拟数据。
* **createMockResponse**：构造Axios格式的假响应。
* **拦截逻辑**：请求发出前检查是否需要Mock，直接返回假数据。

### 3. 请求拦截器

* **Mock处理**：优先处理Mock请求。
* **Token管理**：
  * 检查token是否过期（isTokenExpired）。
  * 过期时调用refreshToken刷新。
  * 添加Authorization头。
* **GET防缓存**：为GET请求添加时间戳。
* **日志**：开发环境打印请求详情。

### 4. 响应拦截器

* **成功处理**：code !== 200时提示错误并拒绝。
* **错误处理**：
  * 401：提示登录过期。
  * 404：提示资源不存在。
  * 网络断开：提示连接失败。
* **数据剥离**：直接返回data，简化调用。

### 5. Token刷新

* **isTokenExpired**：解析JWT的exp字段判断过期。
* **refreshToken**：异步刷新token，使用单例Promise避免并发冲突。

### 6. 重试机制

* **axios-retry**：请求失败时重试3次，间隔递增（1s、2s、3s）。

### 7. 请求方法

* **get**：发送GET请求，支持查询参数。
  * 示例：http.get('/user/info', { id: 1 })
* **post**：发送POST请求，支持请求体。
  * 示例：http.post('/user/login', { username: 'admin' })
* **put**：更新资源（整体替换）。
  * 示例：http.put('/production/1', { status: 'stopped' })
* **delete**：删除资源，支持查询参数。
  * 示例：http.delete('/production/1', { id: 1 })
* **patch**：部分更新资源。
  * 示例：http.patch('/user/1', { role: 'manager' })
* **upload**：文件上传，使用FormData。
  * 示例：http.upload('/upload', file, { type: 'report' })
* **download**：文件下载，处理blob并触发浏览器下载。
  * 示例：http.download('/download/report', { date: '2025-03-22' })
* **poll**：轮询请求，每隔指定时间发起请求，返回取消函数。
  * 示例：http.poll('/production/status', { line: 1 }, 5000, (data) => console.log(data))

## 使用用例

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import http from '@/utils/request'

interface ProductionData {
  id: number
  status: string
  timestamp: number
}

onMounted(async () => {
  try {
    // 获取数据
    const user = await http.get('/user/info')
    console.log('用户信息:', user)

    // 更新数据
    await http.put('/production/1', { id: 1, status: 'stopped' })
    console.log('状态更新成功')

    // 部分更新
    await http.patch('/production/1', { status: 'paused' })
    console.log('状态部分更新成功')

    // 删除数据
    await http.delete('/production/1', { id: 1 })
    console.log('删除成功')

    // 文件上传
    const file = new File(['test'], 'test.txt')
    await http.upload('/upload', file, { type: 'report' })
    console.log('上传成功')

    // 文件下载
    http.download('/download/report', { date: '2025-03-22' })

    // 轮询
    const stopPoll = http.poll<ProductionData>(
      '/production/status',
      { line: 1 },
      5000,
      (data) => console.log('实时状态:', data)
    )

    onUnmounted(() => stopPoll())
  } catch (error) {
    console.error('操作失败:', error)
  }
})
</script>
```

MES系统应用场景
---------

* **实时监控**：使用poll定期获取生产线状态。
* **数据管理**：
  * post/put/patch：创建或更新生产计划。
  * delete：删除无效记录。
* **文件操作**：
  * upload：导入生产数据Excel。
  * download：导出生产报表。
* **权限控制**：通过token刷新机制保持用户登录状态。
* **开发调试**：Mock拦截器模拟后端数据，加速开发。

扩展建议
----

* **Mock增强**：集成mockjs生成动态数据。
  
  
  ```typescript
  import Mock from 'mockjs' mockData['/user/list'] = Mock.mock({ 'list|1-10': [{ 'id|+1': 1, name: '@name' }] })
  ```

* **进度条**：使用nprogress显示请求进度。

* **日志系统**：集成pino记录请求日志。

注意事项
----

* **Token格式**：当前假设JWT格式，需根据实际后端调整isTokenExpired。
* **错误提示**：依赖ElMessage，可替换为其他UI库的提示组件。
* **Mock控制**：通过.env文件配置VITE_ENABLE_MOCK动态开关。

* * *

文档更新日期：2025年3月22日
