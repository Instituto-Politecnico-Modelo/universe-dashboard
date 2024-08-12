/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface TypesCamara {
  id: string;
  location: string;
  name: string;
  threshold: number;
  url: string;
}

export interface TypesData {
  camera_id: string;
  cant: number;
  location: string;
  threshold: number;
  time: string;
}

export interface TypesSnap {
  cameraId: string;
  filename: string;
  id: string;
  personas: number;
  timestamp: string;
  url: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '/api/v1';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
      credentials: 'same-origin',
      headers: {},
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
      Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
      this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
      const encodedKey = encodeURIComponent(key);
      return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
      return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
      const value = query[key];
      return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
      const query = rawQuery || {};
      const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
      return keys
          .map((key) =>
              Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key),
          )
          .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
      const queryString = this.toQueryString(rawQuery);
      return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
      [ContentType.Json]: (input: any) =>
          input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
      [ContentType.Text]: (input: any) =>
          input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
      [ContentType.FormData]: (input: FormData) =>
          (Array.from(input.keys()) || []).reduce((formData, key) => {
              const property = input.get(key);
              formData.append(
                  key,
                  property instanceof Blob
                      ? property
                      : typeof property === 'object' && property !== null
                        ? JSON.stringify(property)
                        : `${property}`,
              );
              return formData;
          }, new FormData()),
      [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
      return {
          ...this.baseApiParams,
          ...params1,
          ...(params2 || {}),
          headers: {
              ...(this.baseApiParams.headers || {}),
              ...(params1.headers || {}),
              ...((params2 && params2.headers) || {}),
          },
      };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
      if (this.abortControllers.has(cancelToken)) {
          const abortController = this.abortControllers.get(cancelToken);
          if (abortController) {
              return abortController.signal;
          }
          return void 0;
      }

      const abortController = new AbortController();
      this.abortControllers.set(cancelToken, abortController);
      return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
      const abortController = this.abortControllers.get(cancelToken);

      if (abortController) {
          abortController.abort();
          this.abortControllers.delete(cancelToken);
      }
  };

  public request = async <T = any, E = any>({
      body,
      secure,
      path,
      type,
      query,
      format,
      baseUrl,
      cancelToken,
      ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
      const secureParams =
          ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
              this.securityWorker &&
              (await this.securityWorker(this.securityData))) ||
          {};
      const requestParams = this.mergeRequestParams(params, secureParams);
      const queryString = query && this.toQueryString(query);
      const payloadFormatter = this.contentFormatters[type || ContentType.Json];
      const responseFormat = format || requestParams.format;

      return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
          ...requestParams,
          headers: {
              ...(requestParams.headers || {}),
              ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
          },
          signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
          body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      }).then(async (response) => {
          const r = response.clone() as HttpResponse<T, E>;
          r.data = null as unknown as T;
          r.error = null as unknown as E;

          const data = !responseFormat
              ? r
              : await response[responseFormat]()
                    .then((data) => {
                        if (r.ok) {
                            r.data = data;
                        } else {
                            r.error = data;
                        }
                        return r;
                    })
                    .catch((e) => {
                        r.error = e;
                        return r;
                    });

          if (cancelToken) {
              this.abortControllers.delete(cancelToken);
          }

          if (!response.ok) throw data;
          return data;
      });
  };
}

/**
* @title No title
* @baseUrl /api/v1
* @contact
*/
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  camara = {

      /**
       * @description Create a new camera
       *
       * @tags cameras
       * @name CamaraCreate
       * @summary Create a new camera
       * @request POST:/camara
       */
      camaraCreate: (body: TypesCamara, params: RequestParams = {}) =>
          this.request<TypesCamara[], any>({
              path: `/camara`,
              method: 'POST',
              body: body,
              type: ContentType.Json,
              format: 'json',
              ...params,
          }),
  };
  camaras = {
      /**
       * @description Get all cameras
       *
       * @tags cameras
       * @name CamarasList
       * @summary Get all cameras
       * @request GET:/camaras
       */
      camarasList: (params: RequestParams = {}) =>
          this.request<TypesCamara[], any>({
              path: `/camaras`,
              method: 'GET',
              format: 'json',
              ...params,
          }),

      /**
       * @description Delete a camera by ID
       *
       * @tags cameras
       * @name CamarasDelete
       * @summary Delete a camera by ID
       * @request DELETE:/camaras/{id}
       */
      camarasDelete: (id: string, params: RequestParams = {}) =>
          this.request<TypesCamara[], any>({
              path: `/camaras/${id}`,
              method: 'DELETE',
              format: 'json',
              ...params,
          }),
  };
  data = {
      /**
       * @description Get the last data collected from each camera
       *
       * @tags stats
       * @name DataList
       * @summary Get the last data collected from each camera
       * @request GET:/data
       */
      dataList: (params: RequestParams = {}) =>
          this.request<TypesData[], any>({
              path: `/data`,
              method: 'GET',
              format: 'json',
              ...params,
          }),

      /**
       * @description Get N data (stats) from a camera
       *
       * @tags stats
       * @name DataDetail
       * @summary Get N data (stats) from a camera
       * @request GET:/data/{camara}/{limite}
       */
      dataDetail: (camara: string, limite: number, params: RequestParams = {}) =>
          this.request<TypesData[], any>({
              path: `/data/${camara}/${limite}`,
              method: 'GET',
              format: 'json',
              ...params,
          }),
  };
  snapshots = {
      /**
       * @description Get all snapshots
       *
       * @tags snapshots
       * @name SnapshotsList
       * @summary Get all snapshots
       * @request GET:/snapshots
       */
      snapshotsList: (params: RequestParams = {}) =>
          this.request<TypesSnap[], any>({
              path: `/snapshots`,
              method: 'GET',
              format: 'json',
              ...params,
          }),

      /**
       * @description Get N snapshots
       *
       * @tags snapshots
       * @name SnapshotsDetail
       * @summary Get N snapshots
       * @request GET:/snapshots/{limite}
       */
      snapshotsDetail: (limite: number, params: RequestParams = {}) =>
          this.request<TypesSnap[], any>({
              path: `/snapshots/${limite}`,
              method: 'GET',
              format: 'json',
              ...params,
          }),
  };
}