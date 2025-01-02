"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zenmoneyApi = void 0;
const auth_1 = __importDefault(require("./auth"));
const httpClient_1 = __importStar(require("./httpClient"));
const unixNow = () => Math.round(Date.now() / 1000);
class ZenmoneyApi {
    async getToken(authData) {
        return auth_1.default.getToken(authData);
    }
    setToken(token) {
        (0, httpClient_1.setToken)(token);
    }
    async authorize(authData) {
        const { accessToken: token } = await this.getToken(authData);
        this.setToken(token);
    }
    async diff({ currentClientTimestamp = unixNow(), serverTimestamp = 0, forceFetch, } = {}) {
        const resp = await httpClient_1.default.post('v8/diff', {
            json: {
                currentClientTimestamp,
                serverTimestamp,
                ...(forceFetch ? { forceFetch } : {}),
            },
        });
        return resp.body;
    }
    async suggest(transaction) {
        const resp = await httpClient_1.default.post('v8/suggest', {
            json: transaction,
        });
        return resp.body;
    }
}
exports.zenmoneyApi = new ZenmoneyApi();
