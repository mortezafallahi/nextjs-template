// import type {
//   ApiResponse,
//   CompleteProfileData,
//   CompleteProfileRequest,
//   MeData,
//   ProfilePageData,
//   SendOtpData,
//   SendOtpRequest,
//   VerifyOtpData,
//   VerifyOtpRequest,
//   UserProfile,
// } from '@/types';
// import { useMutation, useQuery } from '@tanstack/react-query';
// import { Get, Post } from '../lib/requests';

// type UpdateProfilePayload = FormData;
// const postSendOtp = (data: SendOtpRequest) =>
//   Post<ApiResponse<SendOtpData>>('/v2/user/auth/request', { body: data });

// const useSendOtpMutation = () =>
//   useMutation<ApiResponse<SendOtpData>, Error, SendOtpRequest>({
//     mutationKey: ['auth/sendOtp'],
//     mutationFn: postSendOtp,
//   });

// const getMe = () => Get<ApiResponse<MeData>>('/v2/user/auth/me');

// const useMeQuery = (options?: { enabled?: boolean }) =>
//   useQuery({
//     queryKey: ['auth/me'],
//     queryFn: getMe,
//     ...options,
//   });

// const postVerifyOtp = (data: VerifyOtpRequest) =>
//   Post<ApiResponse<VerifyOtpData>>('/v2/user/auth/verify', { body: data });

// const useVerifyOtpMutation = () =>
//   useMutation<ApiResponse<VerifyOtpData>, Error, VerifyOtpRequest>({
//     mutationKey: ['auth/verifyOtp'],
//     mutationFn: postVerifyOtp,
//   });

// const postCompleteProfile = (data: CompleteProfileRequest) =>
//   Post<ApiResponse<CompleteProfileData>>('/v2/user/auth/complete-profile', {
//     body: data,
//   });

// const useCompleteProfileMutation = () =>
//   useMutation<ApiResponse<CompleteProfileData>, Error, CompleteProfileRequest>({
//     mutationKey: ['auth/completeProfile'],
//     mutationFn: postCompleteProfile,
//   });

// const getUserProfile = () =>
//   Get<ApiResponse<ProfilePageData>>('/v1/front/user/profile');

// const useUserProfileQuery = (options?: {
//   enabled?: boolean;
//   refetchOnWindowFocus?: boolean;
//   staleTime?: number;
// }) =>
//   useQuery({
//     queryKey: ['auth', 'profile'],
//     queryFn: getUserProfile,
//     ...options,
//   });

// const updateProfile = (payload: UpdateProfilePayload) =>
//   Post<ApiResponse<UserProfile>>('/v1/front/user/profile', { body: payload });

// const useUpdateProfileMutation = () => {
//   return useMutation<ApiResponse<UserProfile>, Error, UpdateProfilePayload>({
//     mutationKey: ['auth', 'updateProfile'],
//     mutationFn: updateProfile,
//   });
// };

// export const authApi = {
//   getMe,
//   useMeQuery,
//   useVerifyOtpMutation,
//   useSendOtpMutation,
//   useCompleteProfileMutation,
//   useUserProfileQuery,
//   useUpdateProfileMutation,
// };
