import jwt from "jsonwebtoken";

export const verrifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(new Error("No token provided!"));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // This verification is done by the secret key where it is generated correctly
    if (err) return next(new Error("Failed to authenticate token!"));
    req.user = user;
    next();
  });
};
