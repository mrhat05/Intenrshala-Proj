import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function requireSecret(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

export type AdminTokenPayload = {
  email: string;
  role: "admin";
};

export function signAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, requireSecret(JWT_SECRET, "JWT_SECRET"), { expiresIn: "7d" });
}

export function verifyAdminToken(token: string) {
  try {
    const decoded = jwt.verify(token, requireSecret(JWT_SECRET, "JWT_SECRET"));
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "role" in decoded &&
      (decoded as AdminTokenPayload).role === "admin"
    ) {
      return decoded as AdminTokenPayload;
    }
  } catch {
    return null;
  }

  return null;
}
