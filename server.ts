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
      const validateWithAPI = async (url: string) => {
        try {
          const resp = await axios.get(url, { timeout: 5000 });
          return resp.data && resp.data.status === 200 ? resp.data.username : null;
        } catch {
          return null;
        }
      };

      let playerName = null;

      if (game === "mlbb") {
        if (!zone) return res.status(400).json({ error: "Zone ID is required for MLBB" });
        
        // Try multiple public endpoints for MLBB
        playerName = await validateWithAPI(`https://api-reborn-smile.up.railway.app/ml?id=${id}&zone=${zone}`);
        if (!playerName) playerName = await validateWithAPI(`https://nickname-finder.onrender.com/mlbb/${id}/${zone}`);
      } 
      
      if (game === "ff") {
        playerName = await validateWithAPI(`https://api-reborn-smile.up.railway.app/ff?id=${id}`);
        if (!playerName) playerName = await validateWithAPI(`https://nickname-finder.onrender.com/freefire/${id}`);
      }

      if (game === "pubg") {
        playerName = await validateWithAPI(`https://api-reborn-smile.up.railway.app/pubgm?id=${id}`);
        if (!playerName) playerName = await validateWithAPI(`https://nickname-finder.onrender.com/pubgm/${id}`);
      }

      if (playerName) {
        return res.json({ playerName });
      }

      // If still null, provide a generic "Found" message for popular games to not block UX if APIs are laggy
      // But we prefer real validation. For this demo, let's return error if real validation fails.
      res.status(404).json({ error: "Player not found. Check ID/Zone." });
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
