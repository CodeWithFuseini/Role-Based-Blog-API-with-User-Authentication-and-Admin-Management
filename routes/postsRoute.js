const express = require("express");
const {
  addPost,
  editPost,
  deletePost,
  getAllPosts,
  getPost,
} = require("../controllers/postController");
const verifyJwt = require("../middlewares/verifyJwt");
const { addComment } = require("../controllers/commentController");

const router = express.Router();

router.get("all-posts", getAllPosts);
router.get("single-post/:postId", getPost);
router.post("/add-post", verifyJwt, addPost);
router.post("/edit-post/:postId", verifyJwt, editPost);
router.post("/comment", verifyJwt, addComment);
router.delete("/delete-post/:postId", verifyJwt, deletePost);

module.exports = router;
