import axios, { AxiosRequestConfig } from "axios";

export class Api {
	baseUrl: string;
	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}
	getAxiosConfig = (config: AxiosRequestConfig) => {
		const headers = {
			'Content-Type': 'application/json',
			...(config?.headers || {})
		}
		const axiosConfig: AxiosRequestConfig = {
			...config,
			headers,
			baseURL: this.baseUrl
		}
		return axiosConfig;
	}
	async post(endpoint: string, data: any, config: AxiosRequestConfig = {}) {
		return axios.post(endpoint, data, this.getAxiosConfig(config));
	}
	async get(endpoint: string, config: AxiosRequestConfig = {}) {
		return axios.get(endpoint, this.getAxiosConfig(config));
	}
	async put(endpoint: string, data: any, config: AxiosRequestConfig = {}) {
		return axios.put(endpoint, data, this.getAxiosConfig(config));
	}
	async delete(endpoint: string, config: AxiosRequestConfig = {}) {
		return axios.delete(endpoint, this.getAxiosConfig(config));
	}
}
