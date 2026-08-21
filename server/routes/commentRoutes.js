const express = require("express");
const requireAuth = require("../middleware/auth");

const {
  getComments,
  addComment,
  deleteComment,
} = require("../controllers/commentController");

const router = express.Router();

router.get("/projects/:id/comments", getComments);
router.post("/projects/:id/comments", requireAuth, addComment);
router.delete("/comments/:commentId", requireAuth, deleteComment);

module.exports = router;