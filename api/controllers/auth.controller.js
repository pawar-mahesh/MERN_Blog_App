import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

// function for signup
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // check all required fields
  if (
    !username ||
    !email ||
    !password ||
    username.trim().length === 0 ||
    email.trim().length === 0 ||
    password.trim().length === 0
  ) {
    next(errorHandler(400, "All fields are required!"));
  }

  // hash the password using bcryptjs
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // create new schema document using upcoming fields
  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  try {
    // save the newly created userSchema to DB
    await newUser.save();
    res.json("signup successfull");
  } catch (err) {
    if (err.message.includes("E11000 duplicate key error collection")) {
      let duplicate = "";
      err.message.includes("dup key: { username:") && (duplicate = "Username");
      err.message.includes("dup key: { email:") && (duplicate = "Email");
      err.message = `${duplicate} is already exist, please go to log in.`;
    }
    next(err);
  }
};
