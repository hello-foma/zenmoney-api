"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const httpClient_1 = __importDefault(require("./httpClient"));
class AuthApi {
    async getToken({ username, password, apiKey, apiSecret, }) {
        (0, assert_1.default)(username, 'username is required for request');
        (0, assert_1.default)(password, 'password is required for request');
        (0, assert_1.default)(apiKey, 'apiKey is required for request');
        (0, assert_1.default)(apiSecret, 'apiSecret is required for request');
        const redirectUrl = 'http://0.0.0.0';
        await this.collectAuthCookies({
            redirectUrl,
            apiKey,
        });
        const code = await this.getAuthorizeCode({
            username,
            password,
            redirectUrl,
            apiKey,
        });
        const token = await this.requestToken({
            code,
            apiKey,
            apiSecret,
            redirectUrl,
        });
        return token;
    }
    async collectAuthCookies({ redirectUrl, apiKey, }) {
        await httpClient_1.default.get('oauth2/authorize', {
            responseType: 'text',
            searchParams: {
                response_type: 'code',
                client_id: apiKey,
                redirect_uri: redirectUrl,
            },
        });
    }
    async getAuthorizeCode({ username, password, redirectUrl, apiKey, }) {
        const { headers: { location: urlWithCode }, } = await httpClient_1.default.post('oauth2/authorize', {
            responseType: 'text',
            searchParams: {
                response_type: 'code',
                client_id: apiKey,
                redirect_uri: redirectUrl,
            },
            form: {
                username: username,
                password: password,
                auth_type_password: 'Sign in',
            },
            followRedirect: false,
        });
        const query = new URLSearchParams(String(urlWithCode).split('?')[1]);
        const code = query.get('code');
        if (!code) {
            throw new Error('Can not get auth code');
        }
        return code;
    }
    async requestToken({ code, redirectUrl, apiKey, apiSecret, }) {
        const { body: { access_token: accessToken, token_type: tokenType, refresh_token: refreshToken, expires_in: expiresIn, }, } = await httpClient_1.default.post('oauth2/token', {
            form: {
                grant_type: 'authorization_code',
                client_id: apiKey,
                client_secret: apiSecret,
                code: code,
                redirect_uri: redirectUrl,
            },
        });
        return {
            tokenType,
            accessToken,
            refreshToken,
            expiresIn,
        };
    }
}
exports.default = new AuthApi();
