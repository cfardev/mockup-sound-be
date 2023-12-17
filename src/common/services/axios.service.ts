import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class AxiosService {
  private readonly axiosInstance = axios.create();

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  async head<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.head<T>(url, config);
  }

  async options<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.options<T>(url, config);
  }
}
