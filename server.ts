import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";

// --- Types ---
interface RazorpayConfig {
  key_id: string;
  key_secret: string;
}

// --- Lazy Initializers ---
let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined");
    }
    razorpayInstance = new Razorpay({ key_id, key_secret });
  }
  return razorpayInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security and Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for local dev/vite
  }));
  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Razorpay: Create Order
  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const { amount, currency = "INR" } = req.body;
      const rzp = getRazorpay();

      const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await rzp.orders.create(options);
      res.json(order);
    } catch (error: any) {
      console.error("Razorpay Error:", error);
      res.status(500).json({ error: error.message || "Failed to create order" });
    }
  });

  // Razorpay: Webhook Verification
  app.post("/api/payments/webhook", (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
    const signature = req.headers["x-razorpay-signature"] as string;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (signature === digest) {
      console.log("Webhook verified:", req.body.event);
      // Process payment success/failure here
      // Typically you'd update Firestore from here
      res.json({ status: "ok" });
    } else {
      res.status(400).send("Invalid signature");
    }
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Production-grade server running at http://localhost:${PORT}`);
  });
}

startServer();
