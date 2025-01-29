import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPosts,
  updatePost,
} from "../controllers/posts.js";
import validateSchema from "../middleware/validateSchema.js";
import postSchema from "../schemas/postSchema.js";

const postRouter = Router();

postRouter.route("/").get(getPosts);
postRouter.route("/").post(validateSchema(postSchema), createPost);
postRouter.route("/:id").get(getPostById);
postRouter.route("/:id").put(validateSchema(postSchema), updatePost);
postRouter.route("/:id").delete(deletePost);

export default postRouter;
