const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// Tampilkan halaman manajemen kategori
router.get("/", ensureAuthenticated, categoryController.getCategories);

// Tambah kategori baru
router.post("/add", ensureAuthenticated, categoryController.addCategory);

// Hapus kategori
router.post(
  "/delete/:id",
  ensureAuthenticated,
  categoryController.deleteCategory
);

module.exports = router;
