import { HttpInterceptorFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Simple in-memory cache for HTTP responses
 */
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * HTTP Cache Interceptor
 * Caches GET requests for a specified duration
 * Note: Disabled for now to ensure fresh data on each request
 */
export const httpCacheInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>
): Observable<HttpEvent<unknown>> => {
  // Disable caching for now - always fetch fresh data
  // This ensures components get updated data immediately
  return next(req);

  /* Caching disabled - uncomment if needed
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  const cached = cache.get(req.url);
  const now = Date.now();

  // Return cached data if still valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return of(new HttpResponse({ body: cached.data, status: 200 }));
  }

  // Make request and cache response body
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, { data: event.body, timestamp: now });
      }
    })
  );
  */
};

