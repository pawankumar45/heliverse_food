import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      console.log(decoded);
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token has expired" });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid token" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Permission denied" });
    }
    next();
  };
};
