import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const links: Record<string, { originalUrl: string; expiresAt?: Date }> = {};

app.post("/api/shorten", async (req: any, res: any) => {
  const { originalUrl, expiresAt, alias } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "originalUrl is required" });
  }

  const finalAlias = alias || Math.random().toString(36).substring(2, 8);

  if (links[finalAlias]) {
    return res.status(409).json({ error: "Alias already exists" });
  }

  links[finalAlias] = {
    originalUrl,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
  };

  return res.status(201).json({
    message: "Short link created",
    shortUrl: `http://localhost:3000/${finalAlias}`,
  });
});

app.get("/:alias", (req: any, res: any) => {
  const { alias } = req.params;
  const link = links[alias];

  if (!link) {
    return res.status(404).json({ error: "Alias not found" });
  }

  if (link.expiresAt && new Date() > link.expiresAt) {
    return res.status(410).json({ error: "Link expired" });
  }

  return res.redirect(link.originalUrl);
});
app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
