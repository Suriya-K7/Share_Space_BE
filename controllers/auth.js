import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import {
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
  SECRET,
  FEURL,
} from "../utils/config.js";

// register controller

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      location,
      occupation,
    } = req.body;

    const matchedUser = await User.findOne({ email });
    if (matchedUser) {
      res.status(400).json({ message: "user already exists" });
      return;
    }
    // generating random string

    const randomString =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // creating link to activate the account

    const link = `${FEURL}/user/confirm/${randomString}`;

    // creating hashed password

    const hashedPassword = await bcrypt.hash(password, 10);

    // creating and saving new user

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picturePath,
      location,
      occupation,
      resetToken: randomString,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    const savedUser = await newUser.save();

    // sending coformation email using nodemailer

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    const sendMail = async () => {
      const info = await transporter.sendMail({
        from: `"Udhayasooriyan" <${EMAIL_ADDRESS}>`,
        to: newUser.email,
        subject: "Confirm account",
        text: link,
      });
    };

    sendMail();

    res.status(201).json({
      message: `${newUser.firstName} Account Created, Please Check your Email`,
    });

    //
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// login controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password Wrong" });
    }

    const userForToken = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(userForToken, SECRET, { expiresIn: 60 * 60 });

    delete user.password;

    res.status(200).json({ token, user });

    //

    //
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
