import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Game ID Validation API
  app.get("/api/validate/:game/:id/:zone?", async (req, res) => {
    const { game, id, zone } = req.params;

    try {
      if (game === "mlbb") {
        if (!zone) return res.status(400).json({ error: "Zone ID is required for MLBB" });
        
        // Using a common community API for MLBB validation
        // Note: These public APIs can be unstable. In production, consider a paid provider like RapidAPI.
        const response = await axios.get(`https://api-reborn-smile.up.railway.app/ml?id=${id}&zone=${zone}`);
        
        if (response.data && response.data.status === 200) {
          return res.json({ playerName: response.data.username });
        } else {
          return res.status(404).json({ error: "Player not found or API error" });
        }
      } 
      
      if (game === "ff") {
        // Free Fire validation often uses different endpoints
        // Example logic for FF (using a public aggregator if available)
        const response = await axios.get(`https://api-reborn-smile.up.railway.app/ff?id=${id}`);
        if (response.data && response.data.status === 200) {
          return res.json({ playerName: response.data.username });
        }
      }

      if (game === "pubg") {
        const response = await axios.get(`https://api-reborn-smile.up.railway.app/pubgm?id=${id}`);
        if (response.data && response.data.status === 200) {
          return res.json({ playerName: response.data.username });
        }
      }

      // Fallback/Placeholder if game not supported or API fails
      res.status(400).json({ error: "Unsupported game or validation failed" });
    } catch (error) {
      console.error("Validation error:", error);
      res.status(500).json({ error: "External API error" });
    }
  });

  // Vite middleware for development
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
