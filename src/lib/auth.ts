import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { col } from "@/lib/db";
import type { UserDoc, Role } from "@/lib/models";

const SECRET = process.env.JWT_SECRET || "jobtrail-dev-secret-change-me";
const COOKIE = "jt_session";

export type SessionPayload = {
  uid: string;
  role: Role;
  email: string;
};

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}
export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "30d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const jar = await cookies();
  jar.set(COOKIE, signSession(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireUser(): Promise<UserDoc | null> {
  const s = await getSession();
  if (!s) return null;
  return col<UserDoc>("users").findOne({ _id: s.uid });
}

export async function getUserByApiKey(key: string): Promise<UserDoc | null> {
  if (!key) return null;
  return col<UserDoc>("users").findOne({ apiKey: key });
}
