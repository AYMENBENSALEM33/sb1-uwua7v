import { AxiosInstance } from 'axios';
import { LoggerService } from '../logger';

const logger = new LoggerService();

export const setupLoggingInterceptor = (api: AxiosInstance) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const { method, url, params, data } = config;
      
      logger.info(`🌐 API Request: ${method?.toUpperCase()} ${url}`, {
        params,
        data,
        headers: {
          ...config.headers,
          Authorization: '[REDACTED]' // Don't log sensitive headers
        }
      });
      
      return config;
    },
    (error) => {
      logger.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      const { status, config: { url, method }, data } = response;
      
      logger.success(`✅ API Response: ${method?.toUpperCase()} ${url}`, {
        status,
        data: Array.isArray(data) 
          ? `Array[${data.length} items]`
          : data
      });
      
      return response;
    },
    (error) => {
      const { config, response } = error;
      
      logger.error(`❌ API Error: ${config?.method?.toUpperCase()} ${config?.url}`, {
        status: response?.status,
        data: response?.data,
        message: error.message
      });
      
      return Promise.reject(error);
    }
  );
};