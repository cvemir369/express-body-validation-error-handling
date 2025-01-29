import "./db/associations.js";
import express from "express";
import postRouter from "./routers/postRouter.js";
import userRouter from "./routers/userRouter.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use("/posts", postRouter);
app.use("/users", userRouter);

// Handle non-existent routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Handle unsupported HTTP methods
app.use((err, req, res, next) => {
  if (err.status === 405) {
    res.status(405).json({ error: "Method not allowed" });
  } else {
    next(err); // Pass other errors to the default error handler
  }
});

// Default error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An internal server error occurred" });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
