import { isCTL, isToken } from './format.util';
import { isValidSubdomain } from './url.util';

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  extension?: string;
}

export class Cookie {
  readonly name: string;
  readonly value: string;
  readonly options: CookieOptions;

  constructor(name: string, value: string, options: CookieOptions = {}) {
    this.assertIsValidCookieName(name);
    this.assertIsValidCookieValue(value);
    this.assertIsValidCookieOptions(options);

    this.name = name;
    this.value = value;
    this.options = options;
  }

  public toString(): string {
    let result = `Set-Cookie: ${this.name}=${this.value}`;

    // TODO

    return result;
  }

  private assertIsValidCookieName(value: string): void {
    if (!isToken(value)) {
      throw new Error('Invalid cookie name.');
    }
  }

  private assertIsValidCookieValue(value: string): void {
    const isNotValid = value.split('').some((char) => {
      return isCTL(char) || char === ' ' || char === '"' || char === ',' || char === ';' || char === '\\';
    });

    if (isNotValid) {
      throw new Error('Invalid cookie value.');
    }
  }

  private assertIsValidCookieOptions(options: CookieOptions): void {
    if (options.maxAge !== undefined) {
      if (options.maxAge <= 0) {
        throw new Error('Invalid cookie max-age.');
      }
    }

    if (options.domain !== undefined) {
      if (!isValidSubdomain(options.domain)) {
        throw new Error('Invalid cookie domain.');
      }
    }

    if (options.path !== undefined) {
      const isNotValid = options.path.split('').some((char) => {
        return char === ';' || isCTL(char);
      });

      if (isNotValid) {
        throw new Error('Invalid cookie path');
      }
    }

    if (options.extension !== undefined) {
      const isNotValid = options.extension.split('').some((char) => {
        return char === ';' || isCTL(char);
      });

      if (isNotValid) {
        throw new Error('Invalid cookie extension');
      }
    }
  }

}
