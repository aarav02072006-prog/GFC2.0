import bcrypt from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { query } from "@/lib/db";
import { getSessionSecret } from "@/lib/env";
import { SESSION_COOKIE } from "@/lib/session-constants";

const SESSION_DAYS = 30;

type UserRow = { id: string; email: string };
type SessionRow = { user_id: string; email: string };

function tokenHash(token: string) {
  return createHash("sha256").update(`${getSessionSecret()}:${token}`).digest("hex");
}

export function validateCredentials(email: unknown, password: unknown) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    typeof password === "string" && password.length >= 8 && password.length <= 128;
}

export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await query<UserRow>(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
    [email.toLowerCase().trim(), passwordHash],
  );
  return result.rows[0];
}

export async function verifyUser(email: string, password: string) {
  const result = await query<UserRow & { password_hash: string }>(
    "SELECT id, email, password_hash FROM users WHERE email = $1 AND is_active = true",
    [email.toLowerCase().trim()],
  );
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
  return { id: user.id, email: user.email };
}

export async function createSession(userId: string) {
  const rawToken = randomBytes(32).toString("base64url");
  await query(
    "INSERT INTO sessions (user_id, token_hash, expires_at) VALUES ($1, $2, now() + ($3 * interval '1 day'))",
    [userId, tokenHash(rawToken), SESSION_DAYS],
  );
  return rawToken;
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const result = await query<SessionRow>(
    "SELECT s.user_id, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now() AND u.is_active = true",
    [tokenHash(token)],
  );
  return result.rows[0] ? { id: result.rows[0].user_id, email: result.rows[0].email } : null;
}

export async function revokeCurrentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) await query("UPDATE sessions SET revoked_at = now() WHERE token_hash = $1", [tokenHash(token)]);
  await clearSessionCookie();
}

export async function requireSameOrigin() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host = requestHeaders.get("host");
  if (origin && host && new URL(origin).host !== host) throw new Error("Invalid request origin.");
}

type RateEntry = { count: number; resetAt: number };
const attempts = new Map<string, RateEntry>();
export function enforceAuthRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return;
  }
  current.count += 1;
  if (current.count > 10) throw new Error("Too many authentication attempts. Try again in a minute.");
}
