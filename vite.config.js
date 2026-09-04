import { defineConfig } from "vite";
import { resolve, relative, dirname } from "path";
import { readdirSync, statSync } from "fs";

function getHtmlFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = resolve(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (
        entry !== "node_modules" &&
        entry !== "dist" &&
        entry !== "Components"
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
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        getHtmlFiles(".").map((file) => {
          const name = relative(process.cwd(), file)
            .replace(/\\/g, "/")
            .replace(".html", "");

          return [name, file];
        }),
      ),
    },
  },
});