const cache = {} as any;

export interface QueryGet<T extends { query: object }> {
  query: {
    get?: <K extends keyof T["query"]>(key: K) => T[K];
  };
}

interface IOptions extends RequestInit {
  baseData?: any;
  format?: "text" | "json";
  cacheTime?: number;
  baseUrl?: string;
  reduce?: (res: any) => Promise<any>;
  onSuccess?: (res: any) => Promise<any>;
  onError?: (res: any) => Promise<any>;
}

export const baseApi = async (url: string, obj?: any, opt: IOptions = {}) => {
  let body: any = void 0;

  body = obj && JSON.stringify(obj);
  const realUrl = (opt.baseUrl || "") + url;
  const cacheKey = realUrl + body;

  // 若开启缓存，默认在内存中保留3分钟
  if (opt.cacheTime) {
    const old = cache[cacheKey];
    if (old && Date.now() - old.time < opt.cacheTime) {
      return old;
    }
  }

  let isForm = Object.prototype.toString.call(obj) === "[object FormData]";

  if (!(opt as any).headers) {
    (opt as any).headers = {};
  }

  if (!(opt as any).headers["Content-Type"]) {
    if (isForm) {
      (opt as any).headers["Content-Type"] =
        "application/x-www-form-urlencoded";
    } else {
      (opt as any).headers["Content-Type"] = "application/json";
    }
  }

  if (opt.method === "GET" && !(opt as any).headers["Cache-Control"]) {
    (opt as any).headers["Cache-Control"] = "public, max-age=604800, immutable";
  }

  return fetch(realUrl, {
    body,
    ...opt,
    headers: opt.headers,
  })
    .then(async (res) => {
      const data = await res[opt.format || "json"]();
      return { body: data, status: res.status, headers: res.headers };
    })
    .then(async (res) => {
      if (opt.cacheTime) {
        cache[cacheKey] = {
          data: res,
          time: Date.now(),
        };
      }
      if (opt.reduce) {
        res = await Promise.resolve(opt.reduce(res));
      }
      if (opt.onSuccess) {
        await Promise.resolve(opt.onSuccess(res));
      }
      return res;
    })
    .catch(async (err) => {
      if (opt.onError) {
        await Promise.resolve(opt.onError(err));
      }
    });
};

const makeMethod = async (
  method: string,
  name: any,
  query: any,
  body: any,
  baseOptions: IOptions,
  options: IOptions
) => {
  if (typeof window === "undefined") {
    return;
  }
  let url = "/" + name;
  if (query) {
	const searchParams = new URLSearchParams(query)
	url += "?" + searchParams;
  }

  return baseApi(url, body, { ...baseOptions, ...options, method });
};

const restFulKeys = {
  get: true,
  post: true,
  put: true,
  del: true,
  options: true,
} as any;

export const createZeroApi = <T>(opt: IOptions = {}): T => {
  const createProxy = (target: any) => {
    let obj = new Proxy(target, {
      get(target, name: string) {
        if (!target[name]) {
          if (!restFulKeys[name]) {
            target[name] = createProxy({
              ___parent: target.___parent
                ? target.___parent + "/" + name
                : name,
            });
          } else {
            let method = name.toUpperCase();
            if (method === "DEL") {
              method = "DELETE";
            }
            const url = target.___parent;

            target[name] = (prop: any = {}) => {
              let { query, body, options } = prop;
              // 兼容不以 svelte 入参的结构
              if (!query && !body && !options) {
                if (method === "GET") {
                  query = prop;
                } else {
                  body = prop;
                }
              }
              return makeMethod(method, url, query, body, opt, options);
            };
          }
        }
        return target[name];
      },
    });

    return obj;
  };

  return createProxy(opt.baseData || {});
};
