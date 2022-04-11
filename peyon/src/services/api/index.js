import { request, mamaAxios } from './request';

export { mamaAxios };

export const api = {
  auth: {
    signIn: params => request.post('/auth/signin', params),
    signUp: params => request.post('/auth/signup', params),
    forgotPassword: params => request.post('/auth/forgot-password', params),
    refreshToken: params => request.post('/auth/refreshtoken', params),
    verificationEmail: params =>
      request.post('/auth/verification-email', params),
    verificationForgotPassword: params =>
      request.post('/auth/verification-forgot-password', params),
    resendCode: params => request.post('/auth/resend-code', params),
    continueRegister: params => request.post('/auth/signup-continue', params),
    resetPassword: params => request.post('/auth/reset-password', params),
  },
  user: {
    fetch: () => request.get('/get-my-user'),
    getUser: () => request.get('/user/get-user'),
    create: params => request.post('/auth/signup', params),
    updateUser: params => request.post('/user/update-user', params),
    subscribeUser: params => request.post('/user/subscribe-user', params),
    unsubscribeUser: params => request.post('/user/unsubscribe-user', params),
  },
  chat: {
    getChatList: params => request.post('/chat/get-chat-list', params),
  },
  activities: {
    getActivitiesCategories: params =>
      request.post('/activities/get-categories', params),
    subscribeActivity: params =>
      request.post('/activities/subscribe-activity', params),
    unsubscribeActivity: params =>
      request.post('/activities/unsubscribe-activity', params),

    createNewActivities: params =>
      request.post('/activities/create-new-activities', params),
    getActivities: params => request.post('/activities/get-activities', params),
    getMyActivities: params =>
      request.post('/activities/get-my-activities', params),
  },
};
