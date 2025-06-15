const Category = require("../models/Category");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user.id }).sort({
      name: 1,
    });
    res.render("categories", {
      title: "Kelola Kategori",
      categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      userId: req.user.id,
    });
    if (existingCategory) {
      req.flash("error_msg", "Kategori dengan nama tersebut sudah ada.");
      return res.redirect("/categories");
    }
    await Category.create({
      name,
      userId: req.user.id,
    });
    req.flash("success_msg", "Kategori baru berhasil ditambahkan.");
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!category) {
      return res.status(404).send("Kategori tidak ditemukan");
    }
    // TODO: Hapus juga transaksi yang berhubungan dengan kategori ini jika diperlukan
    await Transaction.deleteMany({
      category: req.params.id,
      userId: req.user.id,
    });
    await Category.findByIdAndDelete(req.params.id);
    req.flash(
      "success_msg",
      "Kategori dan semua transaksi terkait telah dihapus."
    );
    res.redirect("/categories");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
