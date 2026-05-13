import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { GoogleService } from "./src/services/googleService";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Public/Admin: Get Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await GoogleService.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Fetch error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Admin: Add Product (Multi-part for Image)
  app.post(
    "/api/products", 
    upload.single('image'),
    async (req, res) => {
      console.log("POST /api/products - Request received");
      try {
        const { imei, name, colour, storage, brand, condition, batteryHealth, infoLink, region, qty, price, imageId } = req.body;
        const file = req.file;

        console.log(`Processing product: ${name}, IMEI: ${imei}`);

        if (!file && !imageId) {
          console.warn("Missing image or imageId");
          return res.status(400).json({ error: "Image file or External Image URL is required for initial provisioning." });
        }

        let bufferStream = undefined;
        let originalName = undefined;

        if (file) {
          console.log(`Uploading file: ${file.originalname}, Size: ${file.size}`);
          bufferStream = new Readable();
          bufferStream.push(file.buffer);
          bufferStream.push(null);
          originalName = file.originalname;
        }

        console.log("Calling GoogleService.addProduct...");
        const result = await GoogleService.addProduct(
          { imei, name, colour, storage, brand, condition, batteryHealth, infoLink, region, qty, price, imageId },
          bufferStream,
          originalName,
          file?.mimetype
        );

        console.log("Product added successfully:", result);
        res.json(result);
      } catch (error: any) {
        console.error("Upload error details:", error);
        res.status(500).json({ 
          error: error.message || "Internal Server Error",
          details: error.response?.data || undefined
        });
      }
    }
  );

  // Admin: Delete Product
  app.delete(
    "/api/products/:id",
    async (req, res) => {
      try {
        const { id } = req.params;
        const result = await GoogleService.deleteProduct(id);
        res.json(result);
      } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ error: "Failed to delete product" });
      }
    }
  );

  // Admin: Update Product
  app.patch(
    "/api/products/:id",
    async (req, res) => {
      try {
        const { id } = req.params;
        const productData = req.body;
        const result = await GoogleService.updateProduct(id, productData);
        res.json(result);
      } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ error: "Failed to update product" });
      }
    }
  );

  app.post("/api/admin/inventory", (req, res) => {
    res.json({ message: "Inventory updated" });
  });

  app.get("/api/super-admin/logs", (req, res) => {
    res.json({ logs: ["System started", "Admin access", "Backup complete"] });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
