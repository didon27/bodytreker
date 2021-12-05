import {request, mamaAxios} from './request';

export {mamaAxios};

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
    getInterests: () => request.get('/interest'),
    fetch: () => request.get('/get-user'),
    getChilds: () => request.get('/child'),
    create: params => request.post('/auth/signup', params),
    updateUser: params => request.post('/user/update-user', params),
    getLanguages: () => request.get('/language'),
    getNationality: () => request.get('/nationality'),
    checkVerificationCode: params =>
      request.post('/check-verification-code', params),
    resendVerificationCode: () => request.post('/resend-confirm-email-code'),
    mamaOnboarding: params => request.post('/mama-onboarding', params),
    addChildren: params => request.post('/child', params),
    removeChildren: params => request.delete('/child', params),
    updateChildren: params => request.put('/child', params),
    getAppUsageTypes: params => request.get('/app-usage-types', params),
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
