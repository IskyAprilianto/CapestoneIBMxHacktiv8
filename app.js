const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // <-- Diimpor

// Passport Config
require("./config/passport")(passport);

// Import routes
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express session middleware
app.use(
  session({
    secret: "secretcat", // Sebaiknya ganti dengan string acak yang lebih aman
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash()); // <-- Digunakan di sini

// Global variables middleware untuk pesan
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); // Untuk pesan error dari Passport
  res.locals.user = req.user || null; // Memindahkan ini ke sini agar konsisten
  next();
});

// Set up routes
app.use("/", transactionRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
