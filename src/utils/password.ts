import { compare, hash } from "bcrypt";

export async function encryptPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashed: string) {
  return compare(password, hashed);
}
