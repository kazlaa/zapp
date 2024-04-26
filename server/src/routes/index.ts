import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import { productRepository } from "../repositories/ProductRepository";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("products"), (req, res) => {

  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const results: any[] = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", ({ sku, description, store, quantity }) => {
      productRepository.create({ sku, description, store, quantity });
      results.push({ sku, description, store, quantity });
    })
    .on("end", () => {
      req.file && fs.unlinkSync(req.file.path);
      res.json(results);
    });
});

router.get("/products", async (req, res) => {
  const { offset, limit } = req.query;

  const offsetValue = parseInt(offset as string);
  const limitValue = parseInt(limit as string);

  if (isNaN(offsetValue) || isNaN(limitValue)) {
    return res.status(400).json({ error: 'Invalid offset or limit' });
  }

  const products = await productRepository.list(offsetValue, limitValue);

  res.json(products);
});

router.get("/product/:sku", async (req, res) => {
  const { sku } = req.params;

  const product = await productRepository.get({ sku });

  return res.json(product);
});

router.put('/product/:sku', async (req, res) => {
  const sku = req.params.sku;
  const updateData = req.body;

  try {
    const updatedProduct = await productRepository.update({sku}, updateData);

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/product/:sku', async (req, res) => {
  const sku = req.params.sku;

  try {
    await productRepository.delete({sku});
    return res.json({ success: `deleted ${sku}`});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
