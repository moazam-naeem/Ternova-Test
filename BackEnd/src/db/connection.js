const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/ternoa-products")
  .then(() => {
    console.log("Database connection successfully");
  })
  .catch(() => {
    console.log("no connection");
  });
