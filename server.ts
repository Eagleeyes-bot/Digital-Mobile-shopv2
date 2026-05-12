import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { rbacMiddleware } from "./src/middleware/rbac";
import { UserRole } from "./src/types/auth";
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

  // Public: Get Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await GoogleService.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Fetch error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Admin Only: Add Product (Multi-part for Image)
  app.post(
    "/api/admin/products", 
    rbacMiddleware([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
    upload.single('image'),
    async (req, res) => {
      try {
        const { name, price, description, category } = req.body;
        const file = req.file;

        if (!file) {
          return res.status(400).json({ error: "Image is required" });
        }

        // Convert Buffer to Stream for Google Drive API
        const bufferStream = new Readable();
        bufferStream.push(file.buffer);
        bufferStream.push(null);

        const result = await GoogleService.addProduct(
          { name, price, description, category },
          bufferStream,
          file.originalname
        );

        res.json(result);
      } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );

  // Admin Only: Inventory Management (Generic)
  app.post("/api/admin/inventory", rbacMiddleware([UserRole.ADMIN, UserRole.SUPER_ADMIN]), (req, res) => {
    res.json({ message: "Inventory updated" });
  });

  // Super Admin Only: User Logs & Management
  app.get("/api/super-admin/logs", rbacMiddleware([UserRole.SUPER_ADMIN]), (req, res) => {
    res.json({ logs: ["System started", "Admin login", "Backup complete"] });
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
