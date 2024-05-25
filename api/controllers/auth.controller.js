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
    return next(errorHandler(400, "All fields are required!"));
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

    res.json({
      success: true,
      status: 200,
      message: "Signup Successfull",
    });
  } catch (err) {
    // Check for duplicate status code (i.e. 11000)
    if (err.code === 11000) {
      let duplicate = Object.keys(err.keyValue)[0];
      duplicate = duplicate[0].toUpperCase() + duplicate.slice(1).toLowerCase();
      err.message = `${duplicate} is already exist, please go to log in.`;
    }
    return next(errorHandler(400, err.message));
  }
};
