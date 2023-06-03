export interface IAttributes {
    maxAge?: number;
    expires?: string;
    httpOnly?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
    secure?: boolean;
    path?: string;
    domain?: string;
}
export interface IConverter {
    read: (value: string) => string;
    write: (value: string) => string;
}
export interface ICookiesJar {
    [x: string]: string;
}
