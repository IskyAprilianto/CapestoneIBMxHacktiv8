const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

// Passport Config
require("./config/passport")(passport);

// Import routes
const transactionRoutes = require("./routes/transactionRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// =======================================================
// LOGIKA KONEKSI DATABASE YANG DIPERBARUI
// =======================================================
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
};

const dbConnectionPromise = dbConnect();
// =======================================================

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Express session middleware
app.use(
  session({
    secret: "secretcat_project_dompet_digital",
    resave: false,
    saveUninitialized: false,
    // Menggunakan koneksi yang sudah ada, bukan membuat yang baru
    store: MongoStore.create({
      clientPromise: dbConnectionPromise.then(conn => conn.connection.getClient()),
      collectionName: 'sessions'
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Global variables middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use("/", transactionRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
