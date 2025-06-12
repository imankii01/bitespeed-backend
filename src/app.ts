import express from "express";
import identifyRoutes from "./routes/identifyRoutes";
import fs from "fs";
import path from "path";
import { marked } from "marked";

const app = express();
app.use(express.json());

app.use("/api", identifyRoutes); // /api/identify
app.get("/", async (req, res) => {
  const readmePath = path.join(__dirname, "../README.md");

  fs.readFile(readmePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error loading README file.");
    }

    const htmlContent = marked(data);
    res.send(`
        <html>
          <head>
            <title>BiteSpeed Backend</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell;
                max-width: 800px;
                margin: 40px auto;
                padding: 20px;
                line-height: 1.6;
              }
              pre {
                background: #f4f4f4;
                padding: 10px;
                overflow-x: auto;
              }
              code {
                background: #eee;
                padding: 2px 4px;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>${htmlContent}</body>
        </html>
      `);
  });
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is healthy 🚀' });
});
export default app;
