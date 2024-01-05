import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const encryptedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username: username,
      email: email,
      password: encryptedPassword,
    });
    await newUser.save();
    res.status(201).json("Username and password added");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const valid_user = await User.findOne({ email: email });
    console.log(valid_user);
    if (!valid_user) {
      const error = new Error("Email not found");
      error.statusCode = 404;
      throw error; // same as return error
    }
    const valid_password = bcryptjs.compareSync(password, valid_user.password);
    if (!valid_password) {
      const error = new Error("Password or Username is incorrect");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        id: valid_user._id, // This feature is in the mongodb
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("access_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    }); // coockie expiration
    res.status(200).json(valid_user);
  } catch (error) {
    next(error);
  }
};
