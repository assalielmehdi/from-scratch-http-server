const trimUrl = (url: string): string => {
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const matchPath = (path: string, url: string): Record<string, string> | null => {
  path = trimUrl(path);
  url = trimUrl(url);

  let { pathname } = new URL(`http://host${url}`);

  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  const pathTokens = path.split('/');
  const urlTokens = pathname.split('/');

  if (pathTokens.length !== urlTokens.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < pathTokens.length; i++) {
    if (pathTokens[i].startsWith(':')) {
      const paramName = pathTokens[i].slice(1);

      params[paramName] = urlTokens[i];
    } else if (pathTokens[i] !== urlTokens[i]) {
      return null;
    }
  }

  return params;
};

const isDigit = (word: string, i: number): boolean => {
  return '0123456789'.includes(word.charAt(i));
};

const isLetter = (word: string, i: number): boolean => {
  return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(word.charAt(i));
};


const isValidLabel = (label: string): boolean => {
  if (label.length === 0) {
    return false;
  }

  if (!isLetter(label, 0) && !isDigit(label, 0)) {
    return false;
  }

  if (!isLetter(label, label.length - 1) && !isDigit(label, label.length - 1)) {
    return false;
  }

  for (let i = 1; i < label.length - 1; i++) {
    if (!isLetter(label, i) && !isDigit(label, i) && label.charAt(i) !== '-') {
      return false;
    }
  }

  return true;
};

/**
 * Checks if a given subdomain is valid as defined in https://www.rfc-editor.org/rfc/rfc1034#section-3.5.
 */
export const isValidSubdomain = (subdomain: string): boolean => {
  if (subdomain.length === 0 || subdomain.length > 255) {
    return false;
  }

  const labels = subdomain.split('.');

  return labels.every(isValidLabel);
};
