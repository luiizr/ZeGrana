import { HttpInterceptorFn } from '@angular/common/http'; export const credenciaisInterceptor: HttpInterceptorFn = (req, next) => next(req.clone({ withCredentials: true }));
