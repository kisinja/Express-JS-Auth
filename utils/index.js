import jwt from "jsonwebtoken";

// Generate token
export const generateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET;

  const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });

  return token;
};