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
