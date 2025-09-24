import type { RequestMethod, RequestOptions } from '@/types';
import { AppError, AppValidationError, ErrorCode } from '@/types/errors';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
console.log('BASE_URL:', BASE_URL);
const IS_LARAVEL = process.env.NEXT_PUBLIC_LARAVEL_BACKEND === 'true';
const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME || 'token';

function getClientToken(): string | undefined {
  if (typeof window !== 'undefined') {
    const Cookies = require('js-cookie');
    return Cookies.get(TOKEN_NAME);
  }
  return undefined;
}

function hasQuery(obj: any): obj is { query: Record<string, any> } {
  return (
    obj &&
    typeof obj === 'object' &&
    'query' in obj &&
    typeof obj.query === 'object'
  );
}

function replaceUrlParams(
  url: string,
  variables: Record<string, any> | FormData
): { url: string; remainingVariables: Record<string, any> | FormData } {
  let remainingVariables: Record<string, any> | FormData =
    variables instanceof FormData ? new FormData() : { ...variables };

  if (variables instanceof FormData) {
    for (const [key, value] of variables) {
      (remainingVariables as FormData).append(key, value);
    }
  }

  const processedUrl = url.replace(/:(\w+)/g, (match, paramName) => {
    let value: any;

    if (remainingVariables instanceof FormData) {
      value = remainingVariables.get(paramName);
      if (value !== null) {
        remainingVariables.delete(paramName);
      }
    } else {
      value = remainingVariables[paramName];
      if (value !== undefined) {
        delete remainingVariables[paramName];
      }
    }

    return value !== undefined && value !== null
      ? encodeURIComponent(String(value))
      : match;
  });

  return { url: processedUrl, remainingVariables };
}

async function baseRequest<T>(
  method: RequestMethod,
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  try {
    const {
      body: optionsBody,
      headers: optionsHeaders,
      query,
      token: optionsToken,
      variables,
      ...rest
    } = options;

    const headers = new Headers(optionsHeaders);
    const token = optionsToken || getClientToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let processedUrl = `${BASE_URL}${url}`;
    let bodyData = optionsBody;
    if (variables) {
      const { url: newUrl, remainingVariables } = replaceUrlParams(
        processedUrl,
        variables
      );
      processedUrl = newUrl;
      if (!bodyData) {
        if (remainingVariables instanceof FormData) {
          bodyData = remainingVariables;
        } else {
          const remainingObj = remainingVariables as Record<string, any>;
          const { query: _, ...bodyVars } = remainingObj;
          if (Object.keys(bodyVars).length > 0) {
            bodyData = bodyVars;
          }
        }
      }
    }
    const queryParams = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([k, v]) =>
        queryParams.append(k, String(v))
      );
    }
    if (variables && !(variables instanceof FormData) && hasQuery(variables)) {
      Object.entries(variables.query).forEach(([k, v]) =>
        queryParams.append(k, String(v))
      );
    }
    let actualMethod = method;
    if (
      IS_LARAVEL &&
      ['PATCH', 'DELETE', 'PUT'].includes(method.toUpperCase())
    ) {
      queryParams.append('_method', method.toUpperCase());
      actualMethod = 'POST';
    }
    const queryString = queryParams.toString();
    if (queryString) {
      processedUrl += `?${queryString}`;
    }
    let body: BodyInit | null = null;
    if (bodyData) {
      if (bodyData instanceof FormData) {
        body = bodyData;
      } else if (typeof bodyData === 'string') {
        body = bodyData;
        headers.set('Content-Type', 'text/plain');
      } else {
        body = JSON.stringify(bodyData);
        headers.set('Content-Type', 'application/json');
      }
    }

    const res = await fetch(processedUrl, {
      method: actualMethod,
      headers,
      body,
      ...rest,
    });

    const payload = await res.json();

    if (!res.ok) {
      const statusToErrorCodeMap: Record<number, ErrorCode> = {
        401: ErrorCode.UNAUTHORIZED,
        403: ErrorCode.FORBIDDEN,
        404: ErrorCode.NOT_FOUND,
        422: ErrorCode.VALIDATION_ERROR,
        500: ErrorCode.INTERNAL_SERVER_ERROR,
        503: ErrorCode.SERVICE_UNAVAILABLE,
      };

      const code = statusToErrorCodeMap[res.status] || ErrorCode.UNKNOWN_ERROR;

      throw new AppError(payload.message || res.statusText, code, res.status);
    }

    if (payload.status === false) {
      if (
        payload.data &&
        Array.isArray(payload.data.validation) &&
        payload.data.validation.length > 0
      ) {
        throw new AppValidationError(payload.data.validation);
      } else {
        const message =
          typeof payload.message === 'string'
            ? payload.message
            : 'خطای پیش‌بینی نشده';
        throw new AppError(message, ErrorCode.UNKNOWN_ERROR, res.status);
      }
    }

    return payload as T;
  } catch (error: any) {
    if (error instanceof AppError || error instanceof AppValidationError) {
      throw error;
    }

    if (
      error.name === 'TypeError' &&
      error.message.includes('Failed to fetch')
    ) {
      console.error('Network Error (Failed to fetch):', error);
      throw new AppError(
        'سرویس در دسترس نیست یا اینترنت قطع است',
        ErrorCode.SERVICE_UNAVAILABLE,
        503
      );
    }

    if (error instanceof SyntaxError) {
      console.error('SyntaxError in baseRequest:', error);
      throw new AppError(
        'پاسخ نامعتبر از سرور (JSON SyntaxError)',
        ErrorCode.PARSE_ERROR,
        500
      );
    }

    console.error('Caught unexpected runtime error:', error);
    throw new AppError(
      error.message || 'یک خطای ناشناخته در برنامه رخ داد',
      ErrorCode.UNKNOWN_ERROR,
      500
    );
  }
}
export const Get = <T>(url: string, options?: RequestOptions) =>
  baseRequest<T>('GET', url, options);
export const Post = <T>(url: string, options?: RequestOptions) =>
  baseRequest<T>('POST', url, options);
export const Put = <T>(url: string, options?: RequestOptions) =>
  baseRequest<T>('PUT', url, options);
export const Patch = <T>(url: string, options?: RequestOptions) =>
  baseRequest<T>('PATCH', url, options);
export const Delete = <T>(url: string, options?: RequestOptions) =>
  baseRequest<T>('DELETE', url, options);
