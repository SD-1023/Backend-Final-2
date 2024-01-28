import { Request, Response } from "express";
import { Op } from "sequelize";
import {
  signupSchema,
  signinSchema,
  changepassSchema,
} from "../validators/validations";
import bcrypt from "bcrypt";
import { UsersModel } from "./../models/users";
import { SessionsModel } from "../models/sessions";
import { v4 as uuidv4 } from "uuid";
import { Session, User } from "../types";
// import { Session, User } from "../types";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    if (page < 0) {
      page = 1;
    }
    if (limit > 160 || limit < 0) {
      limit = 9;
    }

    const search = req.query.search?.toString();
    let conditions: any = {};

    if (search) {
      conditions.username = {
        [Op.like]: `%${req.query.search}%`,
      };
    }

    const allUsers = await UsersModel.findAll({
      where: conditions,
      order: [["id", "ASC"]],
      limit: Number(limit),
      offset: (page - 1) * limit,
    });

    return res.status(200).json({ message: "success", users: allUsers });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.sendStatus(400);
    }
    const userProfile = await UsersModel.findByPk(id);

    return res.status(200).json({ message: "success", user: userProfile });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { error } = signupSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const { username, email, password } = req.body;

    const usernameExists = await UsersModel.findOne({ where: { username } });

    const emailExists = await UsersModel.findOne({ where: { email } });

    if (usernameExists) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    if (emailExists) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = (await UsersModel.create({
      username,
      password: hashedPassword,
      email,
    })) as unknown as User;

    const sessionId = uuidv4();

    const sessionData = await SessionsModel.create({
      sid: sessionId,
      userId: newUser.id,
    });

    res.json({ newUser, sessionId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error2" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { error } = signinSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const { email, password } = req.body;

    const user = (await UsersModel.findOne({
      where: { email },
    })) as unknown as User;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid Email or Password" });
    }

    const sessionId = uuidv4();

    const sessionData = await SessionsModel.create({
      sid: sessionId,
      userId: user.id,
    });

    const result = {
      sessionId,
      userId: user.id,
      username: user.username,
    };
    res.json({ message: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers.authorization;

    const session = (await SessionsModel.findOne({
      where: { sid: sessionId },
    })) as unknown as Session;

    if (!session) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    // log out from current session
    const deletedSessions = await SessionsModel.destroy({
      where: { sid: sessionId },
    });

    if (deletedSessions === 0) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    res.json({ message: "success" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const sessionId = req.headers.authorization;

    const session = (await SessionsModel.findOne({
      where: { sid: sessionId },
    })) as unknown as Session;

    if (!session) {
      return res.status(404).json({ error: "Session ID not found" });
    }

    const userId = session.userId;
    const user = (await UsersModel.findOne({
      where: { id: userId },
    })) as unknown as User;

    const { error } = changepassSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }

    const { currentPassword, newPassword } = req.body;

    if (currentPassword === newPassword) {
      return res.status(401).json({
        error: "New password matches your old password. Choose a new one.",
      });
    }
    if (!(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ error: "Invalid Current Password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [updatedRow] = await UsersModel.update(
      {
        password: hashedPassword,
      },
      { where: { id: userId } }
    );

    if (updatedRow > 0) {
      await SessionsModel.destroy({ where: { userId } });
      return res.status(200).json({ message: "success" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
