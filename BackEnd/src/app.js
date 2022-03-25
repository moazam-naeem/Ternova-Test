const express = require("express");
require("./db/connection");
const productRouter = require("./routers/products");
const app = express();
const port = process.env.port || 4200;
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const upload = multer();

app.use(
  cors({
    allowedHeaders: [
      "sessionId",
      "Content-Type",
      "master-token",
      "authorization",
    ],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);
// app.use(upload.array());
app.use(express.json());
app.use(productRouter);
app.use(express.static("uploads"));

app.listen(port, () => {
  console.log("api server is running");
});
