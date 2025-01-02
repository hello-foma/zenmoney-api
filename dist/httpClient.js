"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToken = void 0;
const got_1 = __importDefault(require("got"));
const tough_cookie_1 = require("tough-cookie");
const defaultContext = {
    token: null,
};
function proxy(org, proxyFn) {
    return new Proxy(proxyFn(org), {
        get: (obj, prop) => (prop in obj ? obj[prop] : org[prop]),
    });
}
const cookieJar = proxy(new tough_cookie_1.CookieJar(), (obj) => {
    return {
        setCookie: async (rawCookie, url) => obj.setCookie(rawCookie, url),
        getCookieString: async (url) => obj.getCookieString(url),
    };
});
const client = got_1.default.extend({
    prefixUrl: 'https://api.zenmoney.ru',
    responseType: 'json',
    retry: {
        limit: 4,
        methods: [
            'GET',
            // currently all POST requests are idempotent and can be safely retried
            'POST',
        ],
    },
    cookieJar,
    hooks: {
        beforeRequest: [
            (options) => {
                const { token } = defaultContext;
                if (token) {
                    options.headers.authorization = `Bearer ${token}`;
                }
            },
        ],
    },
});
const setToken = (token) => {
    defaultContext.token = token;
};
exports.setToken = setToken;
exports.default = client;
