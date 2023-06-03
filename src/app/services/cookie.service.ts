import { Injectable } from '@angular/core';
import Cookies from '../lib/cookies';
import { IAttributes } from '../lib/cookies/types';

type GetInterface = {
    name: string;
    toJson?: boolean;
};
type AddInterface = {
    name: string;
    record: string;
    options?: IAttributes;
};
type UpdateInterface = {
    name: string;
    data: string;
    options?: IAttributes;
};

@Injectable({
    providedIn: 'root',
})
export class CookiesService {
    constructor() {}

    private COOKIES = Cookies.withAttributes({
        path: '/',
        sameSite: 'Strict',
    });

    get({ name }: GetInterface): string | any | null {
        let value = this.COOKIES.get(name);

        if (value) {
            try {
                return JSON.parse(value) as any;
            } catch (error) {
                return value;
            }
        }
        return null;
    }

    add({ name, record, options }: AddInterface) {
        this.COOKIES.set(name, record, options);
    }

    remove({ name, options }: { name: string; options: IAttributes }) {
        this.COOKIES.remove(name, options);
    }
}
