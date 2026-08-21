const Bookmark = require("../models/Bookmark");

async function listBookmarks(req, res) {
  try {
    const bookmarks = await Bookmark.find({ userUid: req.user.uid })
      .populate("projectId");

    const projects = bookmarks
      .map((bookmark) => bookmark.projectId)
      .filter(Boolean);

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Unable to get bookmarks" });
  }
}

async function addBookmark(req, res) {
  try {
    await Bookmark.create({
      userUid: req.user.uid,
      projectId: req.params.projectId,
    });

    res.status(201).json({ message: "Project bookmarked" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already bookmarked" });
    }

    res.status(500).json({ message: "Unable to bookmark project" });
  }
}

async function removeBookmark(req, res) {
  try {
    await Bookmark.findOneAndDelete({
      userUid: req.user.uid,
      projectId: req.params.projectId,
    });

    res.json({ message: "Bookmark removed" });
  } catch (error) {
    res.status(500).json({ message: "Unable to remove bookmark" });
  }
}

module.exports = {
  listBookmarks,
  addBookmark,
  removeBookmark,
};