import "server-only";
import bcrypt from "bcryptjs";

// bcrypt is a compatibility placeholder. Before production, use Argon2id where the deployment
// runtime supports it and benchmark the chosen parameters. Never log passwords or hashes.
export async function hashPassword(password: string): Promise<string> {
  if (password.length < 12 || password.length > 128) {
    throw new Error("Password must be between 12 and 128 characters.");
  }
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
