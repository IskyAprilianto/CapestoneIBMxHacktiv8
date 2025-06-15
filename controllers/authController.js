const passport = require("passport");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
};

exports.getRegister = (req, res) => {
  res.render("register", { title: "Registrasi" });
};

exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      req.flash("error_msg", "Email sudah terdaftar.");
      return res.redirect("/auth/register");
    }
    const newUser = new User({
      name,
      email,
      password,
    });
    await newUser.save();
    req.flash("success_msg", "Registrasi berhasil! Silakan login.");
    res.redirect("/auth/login");
  } catch (err) {
    console.error(err);
    res.redirect("/auth/register");
  }
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "Anda telah berhasil logout.");
    res.redirect("/auth/login");
  });
};
