const { request } = require("express");
const Comment = require("../models/Comment");
const { isValidObjectId } = require("mongoose");

const addComment = async (req, res) => {
  const { comment, postId } = req.body;

  if (!comment) {
    return res.status(403).json("Filleds are required");
  }

  if (!isValidObjectId(postId)) {
    return res.status(403).json("Invalid post ID");
  }

  const comments = new Comment({
    comment,
    postId,
    userId: req.session.userId,
  });

  const saveComment = await comments.save();

  if (!saveComment) {
    return res.status(500).json("Failed to save comment");
  }

  return res.status(201).json("Comment saved successfully");
};

module.exports = { addComment };
