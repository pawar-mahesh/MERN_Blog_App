import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  if (
    !username ||
    !email ||
    !password ||
    username.trim().length === 0 ||
    email.trim().length === 0 ||
    password.trim().length === 0
  ) {
    return res.status(400).json({ message: "All fields are requierd!!" });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });

  try {
    await newUser.save();
    res.json("signup successfull");
  } catch (err) {
    if (err.message.includes("E11000 duplicate key error collection")) {
      let duplicate = "";
      err.message.includes("dup key: { username:") && (duplicate = "Username");
      err.message.includes("dup key: { email:") && (duplicate = "Email");
      err.message = `${duplicate} is already exist, please go to log in.`;
    }
    res.status(500).json({ message: err.message });
  }
};
