const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productImage: { type: String, required: true },
});

const Products = new mongoose.model("Products", productSchema);

module.exports = Products;
