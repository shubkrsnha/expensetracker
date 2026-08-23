const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
    role: "user",
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async (email, password) => {
  // 1. Find user
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Compare password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // 3. Generate JWT
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    }
  );

  // 4. Return token and user information
  return {
    token: token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};