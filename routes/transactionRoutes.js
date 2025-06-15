const express = require("express");
const router = express.Router();
const {
  getTransactions,
  addTransaction,
  deleteTransaction,
  getEditTransaction,
  updateTransaction,
  exportTransactionsCSV,
  exportTransactionsPDF,
} = require("../controllers/transactionController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// Rute utama
router.get("/", ensureAuthenticated, getTransactions);

// Rute untuk menambah transaksi
router.post("/add", ensureAuthenticated, addTransaction);

// Rute untuk halaman edit
router.get("/edit/:id", ensureAuthenticated, getEditTransaction);

// Rute untuk memproses update
router.post("/update/:id", ensureAuthenticated, updateTransaction);

// Rute untuk menghapus transaksi
router.post("/delete/:id", ensureAuthenticated, deleteTransaction);

// Rute baru untuk ekspor
router.get("/export/csv", ensureAuthenticated, exportTransactionsCSV);
router.get("/export/pdf", ensureAuthenticated, exportTransactionsPDF);

module.exports = router;
