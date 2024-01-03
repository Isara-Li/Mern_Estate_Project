import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const encryptedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    username: username,
    email: email,
    password: encryptedPassword,
  });
  try {
    await newUser.save();
    res.status(201).json("Username and password added");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
