import Post from "../models/Post.js";
import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    // Check if user with the same email already exists
    const found = await User.findOne({ where: { email } });
    if (found) {
      return res.status(409).json({
        error: "User with that email already exists",
      });
    }

    // Create the user
    const user = await User.create({ firstName, lastName, email });
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findByPk(id, { include: Post });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      body: { firstName, lastName, email },
      params: { id },
    } = req;

    // Check if the user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user
    await user.update(req.body);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const deleteUser = async (req, res) => {
  const {
    params: { id },
  } = req;
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  await user.destroy();
  res.json({ message: "User deleted" });
};
