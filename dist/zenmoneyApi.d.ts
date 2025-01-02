import type { DiffObject, Transaction } from './types';
export interface ApiAuthData {
    username: string;
    password: string;
    apiKey: string;
    apiSecret: string;
}
declare class ZenmoneyApi {
    getToken(authData: ApiAuthData): Promise<import("./types").AuthData>;
    setToken(token: string): void;
    authorize(authData: ApiAuthData): Promise<void>;
    diff({ currentClientTimestamp, serverTimestamp, forceFetch, }?: DiffObject): Promise<DiffObject>;
    suggest<T extends Partial<Transaction>>(transaction: T): Promise<T>;
}
export declare const zenmoneyApi: ZenmoneyApi;
export {};
