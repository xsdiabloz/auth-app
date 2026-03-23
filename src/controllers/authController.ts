import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Role, User } from "../models/exports.js";
import type { ObjectId } from "mongoose";

const generateToken = (id: string, roles: string[]) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, process.env.SECRET_TOKEN as string, {
    expiresIn: "24h",
  });
};

class authController {
  async signup(req: Request, res: Response) {
    try {
      const { userName, password } = req.body;
      if (!userName || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }
      const candidate = await User.findOne({ userName });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Another user has the same name" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      let userRole = await Role.findOne({ value: "USER" });
      if (!userRole) {
        userRole = new Role({ value: "USER" });
        await userRole.save();
      }
      const user = new User({
        userName,
        password: hashPassword,
        roles: [userRole?.value],
      });
      await user.save();
      return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(400).json({ message: "Registration Error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { userName, password } = req.body;
      const user = await User.findOne({ userName });
      if (!user) {
        return res.status(402).json({ message: "User not found" });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(402).json({ message: "Invalid password" });
      }
      const token = generateToken(user._id.toString(), user.roles);
      return res.json({ token });
    } catch (error) {
      res.status(400).json({ message: "Login Error" });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.json(users);
      res.json("server works");
    } catch (error) {
      console.error("Error", (error as Error).message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new authController();
