import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "./", // ✅ абсолютный путь для SPA на Vercel
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // 🔥 Добавь это — чтобы Vite и Rollup понимали JSX/TSX файлы при сборке
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    outDir: "dist", // папка для билда
    emptyOutDir: true, // очищать перед сборкой
    rollupOptions: {
      input: "./index.html",
    },
  },
  server: {
    fs: { allow: [".."] },
  },
});


