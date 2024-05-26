import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

// funtion for signin
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // check for all the inputs
  if (
    (email && !email.trim()) ||
    (password && !password.trim()) ||
    !email ||
    !password
  ) {
    return next(errorHandler(400, "All fields are required!"));
  }

  try {
    // validate the user already exist
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(400, "No user exist, please check credentials"));
    }

    // compare the password entered by user and the already exsiting password
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(
        errorHandler(400, "Wrong attempt, please check your password")
      );
    }

    // create a jwt token using sing method which require json with unique identity and secrete key as two parameters
    const token = jwt.sign(
      {
        id: validUser._id,
      },
      process.env.JWT_SECRET
    );

    // destruture the data to skip to password
    const { password: pass, ...rest } = validUser._doc;

    // send a response with cookies
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (err) {
    next(err);
  }
};
