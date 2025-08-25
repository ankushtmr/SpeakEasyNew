// backend/src/auth.ts
import { auth } from "express-oauth2-jwt-bearer";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "./db";

// 1) Middleware to verify the JWT from Auth0 (RS256)
export const requireJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

// 2) Extend Express Request with our own field ONLY (accountId).
//    Do NOT redeclare `auth` here — the library already defines it.
declare global {
  namespace Express {
    interface Request {
      accountId?: string;
      // `auth?: VerifyJwtResult` is already declared by express-oauth2-jwt-bearer
    }
  }
}

// 3) Ensure an Account exists for this user and attach accountId to req
export async function attachAccount(req: Request, _res: Response, next: NextFunction) {
  // `req.auth` is provided by express-oauth2-jwt-bearer and includes `payload.sub`
  const sub = req.auth?.payload.sub;
  if (!sub) {
    return next(new Error("No auth subject on request"));
  }

  let account = await prisma.account.findUnique({ where: { authUserId: sub } });
  if (!account) {
    account = await prisma.account.create({ data: { authUserId: sub } });
  }

  req.accountId = account.id;
  next();
}
