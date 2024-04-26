import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import { productRepository } from "../repositories/ProductRepository";
import { IProduct } from "src/interfaces";
import { validateProduct } from "../helpers/validateProduct";
import { BadRequestError, MissingProductFieldError, NotfoundError, handleError } from "../helpers/error";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("products"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const failedProducts: { product: IProduct; reason: string }[] = [];

    await new Promise((resolve, reject) => {
      req.file &&
        fs
          .createReadStream(req.file.path)
          .pipe(csvParser())
          .on("data", async ({ sku, description, store, quantity }) => {
            try {
              await productRepository.create({
                sku,
                description,
                store,
                quantity,
              });
            } catch (error) {
              failedProducts.push({
                product: { sku, description, store, quantity },
                reason: error.message,
              });
            }
          })
          .on("end", () => {
            req.file && fs.unlinkSync(req.file.path);
            resolve("");
          })
          .on("error", (error) => {
            reject(error);
          });
    });

    res.json({ failedProducts });
  } catch (error) {
    handleError(error, res)
  }
});

router.post("/product", async (req, res) => {
  const newProduct = req.body;

  try {
    const invalidFields = validateProduct(newProduct);
    if (invalidFields.length) {
      throw new MissingProductFieldError(invalidFields);
    }
    const newlyAddedProduct = await productRepository.create(newProduct);

    res.json(newlyAddedProduct);
  } catch (error) {
    handleError(error, res);
  }
});

router.get("/products", async (req, res) => {
  const { offset, limit } = req.query;

  try {
    const offsetValue = parseInt(offset as string);
    const limitValue = parseInt(limit as string);
  
    if (isNaN(offsetValue) || isNaN(limitValue)) {
      throw new BadRequestError(`Provide a valid offset and limit`)
    }
  
    const products = await productRepository.list(offsetValue, limitValue);
  
    res.json(products);

  } catch(error) {
    handleError(error, res);
  }
});

router.get("/product/:sku", async (req, res) => {
  try {
    const { sku } = req.params;
  
    const product = await productRepository.get({ sku });
  
    return res.json(product);
  } catch (error) {
    handleError(error, res);
  }
});

router.put("/product/:sku", async (req, res) => {
  const sku = req.params.sku;
  const updateData = req.body;

  try {
    const invalidFields = validateProduct(updateData);
    if (invalidFields.length) {
      throw new MissingProductFieldError(invalidFields);
    }

    const updatedProduct = await productRepository.update({ sku }, updateData);

    if (!updatedProduct) {
      throw new NotfoundError(`Product not found. sku: ${sku}`)
    }

    res.json(updatedProduct);
  } catch (error) {
    handleError(error, res)
  }
});

router.delete("/product/:sku", async (req, res) => {
  const sku = req.params.sku;

  try {
    await productRepository.delete({ sku });
    return res.json({ success: `deleted ${sku}` });
  } catch (error) {
    handleError(error, res)
  }
});

export default router;
