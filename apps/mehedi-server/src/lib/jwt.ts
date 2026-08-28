import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { SessionUser } from '@mehedi/shared';

export function signToken(user: SessionUser, expiresIn: string = '7d'): string {
  return jwt.sign(user, env.JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): SessionUser {
  return jwt.verify(token, env.JWT_SECRET) as SessionUser;
}
