import type { NextFunction, Request, Response } from 'express';
import type { Role, SessionUser } from '../shared/index.js';
import { HttpError } from '../lib/http.js';
import { verifyToken } from '../lib/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new HttpError(401, 'Missing bearer token'));
  }
  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    next(new HttpError(401, 'Invalid or expired token'));
  }
}

// Like requireAuth, but never rejects — attaches req.user when a valid
// bearer token is present, otherwise just moves on. Used by routes (like
// submitting a brief) that behave the same for logged-in and anonymous
// visitors, but want to know which one it is.
export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(header.slice(7));
    } catch {
      // ignore an invalid/expired token — treat the request as anonymous
    }
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new HttpError(401, 'Not authenticated'));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, 'Forbidden'));
    next();
  };
}
