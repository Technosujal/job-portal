import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import url from "url";

const getDirname = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  try {
    const filename = url.fileURLToPath(import.meta.url);
    return path.dirname(filename);
  } catch (e) {
    return process.cwd();
  }
};

export function serveStatic(app) {
  const distPath = path.resolve(getDirname(), "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
