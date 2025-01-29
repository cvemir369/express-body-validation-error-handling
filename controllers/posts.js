import Post from "../models/Post.js";
import User from "../models/User.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ include: User });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    // Validate required fields
    if (!title || !content || !userId) {
      return res.status(400).json({
        error:
          "Missing required fields: title, content, and userId are required",
      });
    }

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create the post
    const post = await Post.create({ title, content, userId });

    // Attach user data to the post response
    post.dataValues.user = user;
    return res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await Post.findByPk(id, { include: User });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const {
      body: { title, content, userId },
      params: { id },
    } = req;

    // Check if the post exists
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the post
    await post.update(req.body);

    // Attach user data to the post response
    post.dataValues.user = user;
    return res.status(200).json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ error: "An internal server error occurred" });
  }
};

export const deletePost = async (req, res) => {
  const {
    params: { id },
  } = req;
  const post = await Post.findByPk(id);
  if (!post) throw new Error("Post not found");
  await post.destroy();
  res.json({ message: "Post deleted" });
};
