const express = require("express");
const requireAuth = require("../middleware/auth");

const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.get("/", getProjects);
router.get("/:id", getProject);
router.post("/", requireAuth, createProject);
router.put("/:id", requireAuth, updateProject);
router.delete("/:id", requireAuth, deleteProject);

module.exports = router;