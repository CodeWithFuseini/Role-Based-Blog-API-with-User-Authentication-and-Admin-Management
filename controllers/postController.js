const { isValidObjectId } = require("mongoose");
const Post = require("../models/Post");

const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).lean();

  if (posts.length < 1) {
    return res.status(404).json("No posts available");
  }

  return res.status(200).json(posts);
};

const getPost = async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(403).json("Invalid post ID");
  }

  const post = await Post.findById(postId).exec();

  if (!post) {
    return res.status(404).json("Post not found");
  }

  return res.status(200).json(post);
};

const addPost = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(403).json("Filleds are required");
    }

    const post = new Post({
      title,
      description,
      userId: req.session.userId,
    });

    const savePost = await post.save();

    if (!savePost) {
      return res.status(500).json("Failed to save post");
    }

    return res.status(201).json({
      message: "Post created successfully",
    });
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

const editPost = async (req, res) => {
  const { postId } = req.params;

  const { title, description } = req.body;

  if (!isValidObjectId(postId)) {
    return res.status(403).json("Invalid post ID");
  }

  const foundPost = await Post.findById(postId).exec();

  if (!foundPost) {
    return res.status(404).json("Post not found");
  }

  if (String(foundPost.userId) !== req.session.userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized to access to edit someone's Post" });
  }

  foundPost.title = title || foundPost.title;
  foundPost.description = description || foundPost.description;

  const savePost = await foundPost.save();

  if (!savePost) {
    return res.status(200).json({ message: "Error updating post" });
  }

  return res
    .status(200)
    .json({ message: "Post updated successfully", updatedPost: savePost });
};

const deletePost = async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    return res.status(403).json("Invalid post ID");
  }

  const foundPost = await Post.findById(postId).exec();

  if (!foundPost) {
    return res.status(404).json("Post not found");
  }

  console.log(String(foundPost.userId), req.session.userId);
  if (String(foundPost.userId) !== req.session.userId) {
    return res
      .status(403)
      .json({ message: "Unauthorized to access to delete someone's Post" });
  }

  const removePost = await Post.deleteOne({ _id: foundPost._id });

  if (removePost.deletedCount < 1) {
    return res.status(500).json("Failed to delete post");
  }

  return res.status(200).json(`Post of ${postId} deleted successfully`);
};

module.exports = { getAllPosts, getPost, addPost, editPost, deletePost };
