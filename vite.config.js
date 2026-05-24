import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    watch: {
      usePolling: true,
      interval: 300,
    },
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5174,
      clientPort: 5174,
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});