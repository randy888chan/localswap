import type { MiddlewareHandler } from 'hono';

export function rangoErrorHandler(): MiddlewareHandler {
  return async (c, next) => {
    try {
      await next();
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Rango Error:`, err);
      
      return c.json({
        error: "swap_failed",
        docs: "https://docs.example.com/troubleshooting",
        requestId: c.res.headers.get('cf-ray')
      }, 500);
    }
  };
}
