const express = require("express");
const router = new express.Router();
const Product = require("../models/products");
const { ensureAuthenticated } = require("../middleware/auth");
const jsonWebToken = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

// const fileFilters = (req, file, cb) => {
//   if (file.mimeType === "image/jpeg" || file.mimeType === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({ storage: storage });

const generateToken = (req, res, next) => {
  try {
    let r = (Math.random() + 1).toString(36).substring(7);
    const accessToken = jsonWebToken.sign(r, process.env.TOKEN_SECRET);
    return res.status(200).json({ success: true, token: accessToken });
  } catch (err) {
    console.log(err);
  }
};

router.post("/generateToken", generateToken);

router.post(
  "/addproduct",
  ensureAuthenticated,
  upload.single("productImage"),
  (req, res) => {
    const filePath = req.file.path.split("/");
    const product = new Product({ ...req.body, productImage: filePath[1] });
    product
      .save()
      .then(() => {
        res.status(201).send(req.body);
      })
      .catch((e) => {
        res.status(400).send(e);
      });
  }
);

router.get("/listproducts/:rno", ensureAuthenticated, (req, res) => {
  Product.find()
    .limit(Number(req.params.rno))
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.get("/product/:id", ensureAuthenticated, (req, res) => {
  const _id = req.params.id;
  Product.findById(_id)
    .then((data) => {
      if (!data) {
        res.status(404).send();
      } else {
        res.status(200).send(data);
      }
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.delete("/product/:id", ensureAuthenticated, (req, res) => {
  const _id = req.params.id;
  if (!_id) {
    res.status(400).send("id not found");
  } else {
    Product.findByIdAndDelete(_id)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((e) => {
        res.status(500).send(e);
      });
  }
});

router.patch("/product/:id", ensureAuthenticated, (req, res) => {
  const _id = req.params.id;
  Product.findByIdAndUpdate(_id, req.body, { new: true })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      res.status(404).send(e);
    });
});
router.post(
  "/productImageupdate",
  ensureAuthenticated,
  upload.single("updateImage"),
  (req, res) => {
    try {
      const filePath = req.file.path.split("/");
      res.status(200).send(filePath[1]);
    } catch (e) {
      res.status(500).send(e);
    }
  }
);

module.exports = router;
