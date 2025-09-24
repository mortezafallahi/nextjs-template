export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestVariables extends Record<string, any> {
  query?: Record<string, string | number | boolean>;
}

export interface RequestOptions extends Omit<RequestInit, 'method' | 'body'> {
  body?: FormData | Record<string, any> | string;
  query?: Record<string, string | number | boolean>;
  token?: string;
  variables?: RequestVariables | FormData;
}

export type ApiResponse<T> = {
  status: boolean;
  data: T;
  message: string;
};

export interface KeyValue {
  key: string;
  value: string;
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface Status {
  key: string;
  value: string;
}
