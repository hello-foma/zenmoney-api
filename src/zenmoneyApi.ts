import type { DiffObject, Transaction, UnixTimestamp } from './types';
import auth from './auth';
import client, { setToken } from './httpClient';

const unixNow = (): UnixTimestamp => Math.round(Date.now() / 1000);

export interface ApiAuthData {
  username: string;
  password: string;
  apiKey: string;
  apiSecret: string;
}

class ZenmoneyApi {
  async getToken(authData: ApiAuthData) {
    return auth.getToken(authData);
  }

  setToken(token: string) {
    setToken(token);
  }

  async authorize(authData: ApiAuthData) {
    const { accessToken: token } = await this.getToken(authData);

    this.setToken(token);
  }

  async diff({
    currentClientTimestamp = unixNow(),
    serverTimestamp = 0,
    forceFetch,
  }: DiffObject = {}): Promise<DiffObject> {
    const resp = await client.post<DiffObject>('v8/diff', {
      json: {
        currentClientTimestamp,
        serverTimestamp,
        ...(forceFetch ? { forceFetch } : {}),
      },
    });

    return resp.body;
  }

  async suggest<T extends Partial<Transaction>>(transaction: T): Promise<T> {
    const resp = await client.post<T>('v8/suggest', {
      json: transaction,
    });

    return resp.body;
  }
}

export const zenmoneyApi = new ZenmoneyApi();
