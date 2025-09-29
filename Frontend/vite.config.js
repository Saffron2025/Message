import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",   // 👈 ye line add karo (relative assets ke liye)
  build: {
    outDir: "dist", // 👈 optional, default bhi yehi hota hai
  },
});
