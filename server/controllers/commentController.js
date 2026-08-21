const Comment = require("../models/Comment");
const Project = require("../models/Project");

async function getComments(req, res) {
  try {
    const comments = await Comment.find({ projectId: req.params.id })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Unable to get comments" });
  }
}

async function addComment(req, res) {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerUid === req.user.uid) {
      return res.status(400).json({ message: "You cannot review your own project" });
    }

    const { text, rating } = req.body;

    if (!text || !rating) {
      return res.status(400).json({ message: "Comment and rating are required" });
    }

    const newComment = await Comment.create({
      projectId: req.params.id,
      userUid: req.user.uid,
      userEmail: req.user.email,
      userName: req.user.name || "",
      text,
      rating,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Unable to add comment" });
  }
}

async function deleteComment(req, res) {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userUid !== req.user.uid) {
      return res.status(403).json({ message: "You can delete only your own comment" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete comment" });
  }
}

module.exports = {
  getComments,
  addComment,
  deleteComment,
};