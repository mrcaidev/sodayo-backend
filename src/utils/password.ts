import { compare, hash } from "bcrypt";

/**
 * 单向加密密码。
 * @param password 明文密码。
 * @returns 加密结果。
 */
export async function encryptPassword(password: string) {
  return hash(password, 10);
}

/**
 * 检查明文密码与加密密码是否一致。
 * @param password 明文密码。
 * @param hashed 加密密码。
 * @returns 密码是否一致。
 */
export async function verifyPassword(password: string, hashed: string) {
  return compare(String(password), String(hashed));
}
