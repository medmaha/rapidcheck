import { Injectable } from '@angular/core';
import { CollectionArray, RequestTab } from '../models';
import { BehaviorSubject } from 'rxjs';
import axios, { AxiosError, AxiosResponse } from 'axios';

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
    function (config) {
        // @ts-ignore
        config.metadata = { startTime: new Date() };
        return config;
    },
    function (error) {
        error.config.metadata = { startTime: new Date() };
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        // @ts-ignore
        response.config.metadata.endTime = new Date();
        // @ts-ignore prettier-ignore
        response.duration =
            // @ts-ignore
            response.config.metadata.endTime -
            // @ts-ignore
            response.config.metadata.startTime;
        return response;
    },
    function (error: any) {
        error.config.metadata.endTime = new Date();
        error.duration =
            error.config.metadata.endTime - error.config.metadata.startTime;
        return Promise.reject(error);
    }
);
@Injectable({
    providedIn: 'root',
})
export class RequestService {
    constructor() {}

    async send(data: any): Promise<AxiosResponse | AxiosError> {
        try {
            const response = await axiosInstance(data);
            return response;
        } catch (error) {
            return error as AxiosError;
        }
    }
}
