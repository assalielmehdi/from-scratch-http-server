import { HeaderObject, HTTPParser, HTTPParserJS, RequestMethod } from 'http-parser-js';

export interface ParseResult {
  method: RequestMethod;
  url: string;
  versionMajor: number;
  versionMinor: number;
  headers: HeaderObject;
  body: Buffer;
}

export class Parser {
  private static instance: Parser | null = null;
  private readonly parser: HTTPParserJS;

  private constructor() {
    this.parser = new HTTPParser(HTTPParser.REQUEST);
  }

  public static getInstance(): Parser {
    if (this.instance === null) {
      this.instance = new Parser();
    }

    return this.instance;
  }

  public parse(input: Buffer): ParseResult {
    let complete = false;
    let method: RequestMethod;
    let url: string;
    let versionMajor: number;
    let versionMinor: number;
    let headers: HeaderObject = [];
    let bodyChunks: Buffer[] = [];

    this.parser[HTTPParser.kOnHeadersComplete] = (req) => {
      method = HTTPParser.methods[req.method];
      url = req.url;
      versionMajor = req.versionMajor;
      versionMinor = req.versionMinor;
      headers = req.headers;
    };

    this.parser[HTTPParser.kOnBody] = (chunk, offset, length) => {
      bodyChunks.push(chunk.subarray(offset, offset + length));
    };

    this.parser[HTTPParser.kOnMessageComplete] = () => {
      complete = true;
    };

    this.parser.execute(input);
    this.parser.finish();

    if (!complete) {
      throw new Error('Could not parse request');
    }

    const body = Buffer.concat(bodyChunks);

    return {
      method: method!,
      url: url!,
      versionMajor: versionMajor!,
      versionMinor: versionMinor!,
      headers,
      body
    };
  }
}
