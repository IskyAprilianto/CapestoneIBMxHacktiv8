const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const { Parser } = require("json2csv");
const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");

exports.getTransactions = async (req, res) => {
  try {
    const { filter } = req.query;
    const query = { userId: req.user.id };
    const now = new Date();
    let startDate, endDate;

    switch (filter) {
      case "this_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        query.date = { $gte: startDate, $lte: endDate };
        break;
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        query.date = { $gte: startDate, $lte: endDate };
        break;
      case "this_year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        query.date = { $gte: startDate, $lte: endDate };
        break;
      case "all":
      default:
        break;
    }

    const transactions = await Transaction.find(query)
      .populate("category")
      .sort({ date: -1 });

    const categories = await Category.find({ userId: req.user.id }).sort({
      name: 1,
    });

    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });
    const balance = totalIncome - totalExpense;

    res.render("index", {
      title: "Dashboard",
      transactions,
      categories,
      totalIncome,
      totalExpense,
      balance,
      filter: filter || "all",
      formatRupiah: (number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(number),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category } = req.body;
    await Transaction.create({
      title,
      amount,
      type,
      category,
      userId: req.user.id,
    });
    req.flash("success_msg", "Transaksi berhasil ditambahkan.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash(
      "error_msg",
      "Gagal menambahkan transaksi. Pastikan semua field terisi."
    );
    res.redirect("/");
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!transaction) {
      return res
        .status(404)
        .send("Transaksi tidak ditemukan atau Anda tidak punya hak akses.");
    }
    await Transaction.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Transaksi berhasil dihapus.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getEditTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("category");
    const categories = await Category.find({ userId: req.user.id }).sort({
      name: 1,
    });
    if (!transaction) {
      return res
        .status(404)
        .send("Transaksi tidak ditemukan atau Anda tidak punya hak akses.");
    }
    res.render("edit", {
      title: "Edit Transaksi",
      transaction,
      categories,
      formatRupiah: (number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(number),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, category } = req.body;
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!transaction) {
      return res
        .status(404)
        .send("Transaksi tidak ditemukan atau Anda tidak punya hak akses.");
    }
    await Transaction.findByIdAndUpdate(req.params.id, {
      title,
      amount,
      type,
      category,
    });
    req.flash("success_msg", "Transaksi berhasil diperbarui.");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.exportTransactionsCSV = async (req, res) => {
  try {
    const { filter } = req.query;
    const query = { userId: req.user.id };
    const now = new Date();
    let startDate, endDate;

    switch (filter) {
      case "this_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        query.date = { $gte: startDate, $lte: endDate };
        break;
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        query.date = { $gte: startDate, $lte: endDate };
        break;
      case "this_year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        query.date = { $gte: startDate, $lte: endDate };
        break;
    }

    const transactions = await Transaction.find(query)
      .populate("category")
      .sort({ date: "desc" });
    const fields = [
      {
        label: "Tanggal",
        value: (row) => new Date(row.date).toLocaleDateString("id-ID"),
      },
      { label: "Judul", value: "title" },
      { label: "Kategori", value: "category.name" },
      {
        label: "Tipe",
        value: (row) => (row.type === "income" ? "Pemasukan" : "Pengeluaran"),
      },
      { label: "Jumlah", value: "amount" },
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transaksi.csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.exportTransactionsPDF = async (req, res) => {
  try {
    const { filter } = req.query;
    const query = { userId: req.user.id };
    let periodText = "Semua Waktu";
    const now = new Date();
    let startDate, endDate;

    switch (filter) {
      case "this_month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        query.date = { $gte: startDate, $lte: endDate };
        periodText = "Bulan Ini";
        break;
      case "last_month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        query.date = { $gte: startDate, $lte: endDate };
        periodText = "Bulan Lalu";
        break;
      case "this_year":
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        query.date = { $gte: startDate, $lte: endDate };
        periodText = "Tahun Ini";
        break;
    }

    const transactions = await Transaction.find(query)
      .populate("category")
      .sort({ date: "desc" });
    let totalIncome = 0,
      totalExpense = 0;
    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
      }
    });
    const balance = totalIncome - totalExpense;

    const templatePath = path.join(__dirname, "../views/report-template.ejs");
    const html = await ejs.renderFile(templatePath, {
      user: req.user,
      transactions,
      totalIncome,
      totalExpense,
      balance,
      period: periodText,
      formatRupiah: (number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(number),
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.header("Content-Type", "application/pdf");
    res.attachment("laporan-transaksi.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
