
import { defineConfig } from "vite";
import { resolve, relative } from "path";
import { readdirSync, statSync } from "fs";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


function getHtmlFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (
        !["node_modules", "dist", "Components"].includes(entry)
      ) {
        getHtmlFiles(fullPath, files);
      }
    } else if (entry.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },

  build: {
    rollupOptions: {
      input: Object.fromEntries(
        getHtmlFiles(".").map((file) => {
          const name = relative(process.cwd(), file)
            .replace(/\\/g, "/")
            .replace(".html", "");

          return [name, file];
        })
      ),
    },
  },
});
