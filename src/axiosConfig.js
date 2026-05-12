// 引入axios
import axios from 'axios';

// 访问密钥
const ACCESS_SECRET = 'VrxvFQyuXT29dzTm8TAjfJ1y7b5XyoAu';

// 创建一个配置好的axios实例
const apiClient = axios.create({
  // 基础URL，根据您的API设置
  baseURL: 'https://developer.zhihu.com',
  
  // 请求超时时间（毫秒）
  timeout: 10000,
  
  // 默认请求头
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器，用于添加统一的请求头
apiClient.interceptors.request.use(
  (config) => {
    // 添加Authorization头
    config.headers.Authorization = `Bearer ${ACCESS_SECRET}`;
    
    // 添加X-Request-Timestamp头（秒级Unix时间戳）
    const timestamp = Math.floor(Date.now() / 1000);
    config.headers['X-Request-Timestamp'] = timestamp.toString();
    
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器，用于处理响应
apiClient.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    console.error('响应拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 示例1：GET请求
export const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('GET请求失败:', error);
    throw error;
  }
};

// 示例2：POST请求
export const postData = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('POST请求失败:', error);
    throw error;
  }
};

// 示例3：PUT请求
export const putData = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('PUT请求失败:', error);
    throw error;
  }
};

// 示例4：DELETE请求
export const deleteData = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('DELETE请求失败:', error);
    throw error;
  }
};

// 示例5：PATCH请求
export const patchData = async (endpoint, data = {}) => {
  try {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('PATCH请求失败:', error);
    throw error;
  }
};

// 示例6：带有自定义请求头的特定请求
export const customRequest = async (method, endpoint, data = null, customHeaders = {}) => {
  try {
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
      headers: { ...customHeaders }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    console.error(`${method.toUpperCase()}请求失败:`, error);
    throw error;
  }
};

// 示例7：并发请求
export const makeConcurrentRequests = async (requests) => {
  try {
    const responses = await axios.all(requests.map(request => apiClient(request)));
    return responses.map(response => response.data);
  } catch (error) {
    console.error('并发请求失败:', error);
    throw error;
  }
};

// 测试函数
export const testApiCalls = async () => {
  console.log('开始测试API调用...');
  
  try {
    // 测试GET请求
    const getResult = await fetchData('/users', { page: 1, limit: 10 });
    console.log('GET请求成功:', getResult);
    
    // 测试POST请求
    const postResult = await postData('/users', { 
      name: '张三', 
      email: 'zhangsan@example.com' 
    });
    console.log('POST请求成功:', postResult);
    
    // 测试自定义请求
    const customResult = await customRequest('PUT', '/users/123', { 
      name: '李四' 
    });
    console.log('自定义PUT请求成功:', customResult);
    
    return { getResult, postResult, customResult };
  } catch (error) {
    console.error('测试失败:', error);
    return null;
  }
};

// 在Vue 3中的使用示例
export const useApi = () => {
  // 在Vue组件中使用
  return {
    fetchData,
    postData,
    putData,
    deleteData,
    patchData,
    customRequest,
    makeConcurrentRequests
  };
};

// 默认导出配置好的axios实例
export default apiClient;
