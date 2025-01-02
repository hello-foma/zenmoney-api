import type { AuthData } from './types';
declare class AuthApi {
    getToken({ username, password, apiKey, apiSecret, }: {
        username: string;
        password: string;
        apiKey: string;
        apiSecret: string;
    }): Promise<AuthData>;
    private collectAuthCookies;
    private getAuthorizeCode;
    private requestToken;
}
declare const _default: AuthApi;
export default _default;
