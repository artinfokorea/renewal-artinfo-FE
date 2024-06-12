export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/inquiry', '/my-profile', '/jobs/create'],
};
