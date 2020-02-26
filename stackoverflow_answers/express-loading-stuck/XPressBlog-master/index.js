const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const app = express();

dotenv.config();

//Conect to MONGODB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("conected");
  });

mongoose.connection.on("error", err => {
  console.log(`DB connection error: ${err.message}`);
});

// Set static directory
app.use(express.static(path.join(__dirname, "public")));

// Set views directory
app.set("views", path.join(__dirname, "views"));

// Set view engine
app.set("view engine", "ejs");

// Use Express Layouts
app.use(expressLayouts);

// Middleware
app.use(morgan("dev"));

// Bring the Dashboard
const dashboardRoute = require("./routes/admin/dashboard");

// Get Dashboard Routes
app.use('/dashboard', dashboardRoute);

// Bring the Posts Routes
const postsRoute = require('./routes/front-end/posts');

// Register Posts Routes
app.use('/', postsRoute);


const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
