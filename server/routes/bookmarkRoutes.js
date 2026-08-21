const express = require("express");
const requireAuth = require("../middleware/auth");

const {
  listBookmarks,
  addBookmark,
  removeBookmark,
} = require("../controllers/bookmarkController");

const router = express.Router();

router.use(requireAuth);

router.get("/", listBookmarks);
router.post("/:projectId", addBookmark);
router.delete("/:projectId", removeBookmark);

module.exports = router;