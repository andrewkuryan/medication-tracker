export type ContentType = 'json' | 'formdata';
export type Query = { [_: string]: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Body = any;
export type Headers = { [_: string]: string };
export type ExpectedHeaders = { [_: string]: { value: string, errorMessage?: string } };

export interface FetchingRequest {
  url: string;
  query?: Query;
}

export interface FullRequest extends FetchingRequest {
  body?: Body;
  headers?: Headers;
}

function buildQueryString(query: Query) {
  return Object.entries(query)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
}

function buildFormData(body: Body): FormData {
  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

export class ApiError extends Error {
  constructor(message: string, readonly code: number) {
    super(message);
  }
}

export default class BackendApi {
  private baseHeaders: Headers = {};

  private baseExpectedHeaders: ExpectedHeaders = {};

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private readonly baseUrl: string) {}

  setBaseHeaders = (headers: Headers) => {
    this.baseHeaders = headers;
  };

  setBaseExpectedHeaders = (headers: ExpectedHeaders) => {
    this.baseExpectedHeaders = headers;
  };

  buildFullUrl = (url: string, query?: Query) => {
    if (query) {
      return `${this.baseUrl}${url}?${buildQueryString(query)}`;
    }
    return `${this.baseUrl}${url}`;
  };

  request = <T>(
    method: string,
    contentType: ContentType | null,
    {
      url, query, body, headers,
    }: FullRequest,
  ): Promise<T> => fetch(this.buildFullUrl(url, query), {
    method,
    headers: {
      ...this.baseHeaders,
      ...headers,
      ...(contentType === 'json' ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body && contentType === 'json' ? { body: JSON.stringify(body) } : {}),
    ...(body && contentType === 'formdata' ? { body: buildFormData(body) } : {}),
  })
    .then(async (res) => {
      if (res.ok) {
        return res;
      }
      const errorTest = await res.text();
      throw new ApiError(errorTest, res.status);
    })
    .then((res) => {
      Object.entries(this.baseExpectedHeaders).forEach(([key, { value, errorMessage }]) => {
        if (res.headers.get(key) !== value) {
          throw new Error(errorMessage ?? `Expected header ${key}: ${value} but got ${key}: ${res.headers.get(key)}`);
        }
      });
      return res;
    })
    .then((res) => res.json());

  get = <T>(data: FetchingRequest) => this.request<T>('GET', null, data);

  post = <T>(data: FullRequest, contentType: ContentType = 'json') => this.request<T>('POST', contentType, data);

  put = <T>(data: FullRequest, contentType: ContentType = 'json') => this.request<T>('PUT', contentType, data);
}
