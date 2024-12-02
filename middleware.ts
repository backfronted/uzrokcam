import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const protectedRoute = createRouteMatcher([
  '/',
  '/upcoming',
  '/meeting(.*)',
  '/previous',
  '/recordings',
  '/personal-room',
]);

export default clerkMiddleware(async (auth, req) => {
  if (protectedRoute(req)) {
    const authObject = await auth(); // Дожидаемся выполнения промиса
    
    // Проверяем, авторизован ли пользователь
    if (!authObject.userId) {
      return authObject.redirectToSignIn(); // Перенаправляем на страницу входа
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
