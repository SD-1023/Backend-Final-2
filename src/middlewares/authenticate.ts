import { Request, Response, NextFunction } from "express";
import { SessionsModel } from "../models/sessions";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.headers.authorization;

    if (!sessionId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Session ID not provided" });
    }

    const session = await SessionsModel.findOne({
      where: { sid: sessionId },
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
