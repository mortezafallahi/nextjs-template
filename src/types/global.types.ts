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

export interface SendOtpRequest {
  mobile: string;
}

export interface SendOtpData {
  expires_at: number;
}

export interface VerifyOtpRequest {
  mobile: string;
  code: string;
}

export interface VerifyOtpData {
  token: string;
  is_profile_completed: boolean;
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  mobile: string;
  email: string;
  gender: string;
  birth_date: string;
  height: number;
  weight: number;
}

export interface MeData {
  user: UserProfile;
}

export interface CompleteProfileRequest {
  first_name: string;
  last_name: string;
  gender: 'male' | 'female';
  birth_date: string;
  height: number;
  weight: number;
}

export interface CompleteProfileData {
  user: UserProfile;
}

export interface ProfilePageData {
  user: UserProfile;
}
