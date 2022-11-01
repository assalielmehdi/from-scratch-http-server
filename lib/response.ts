import { Socket } from 'net';
import { Cookie } from './cookie';

export class Response {
  private _socket: Socket;
  private _status: number;
  private _reason: string;
  private _headers: Record<string, string | number>;
  private _cookies: Cookie[];
  private _body: Buffer;

  public constructor(socket: Socket) {
    this._socket = socket;
    this._status = 200;
    this._reason = 'Ok';
    this._headers = {};
    this._cookies = [];
    this._body = Buffer.from('');
  }

  public status(status: number): Response {
    this._status = status;

    return this;
  }

  public reason(reason: string): Response {
    this._reason = reason;

    return this;
  }

  public header(name: string, value: string): Response {
    this._headers[name] = value;

    return this;
  }

  public cookie(cookie: Cookie): Response {
    this._cookies.push(cookie);

    return this;
  }

  public body(body: string): Response {
    this._body = Buffer.from(body);

    return this;
  }

  public send(): void {
    // TODO
  }
}
