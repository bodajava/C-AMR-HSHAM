import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig({
  plugins: [
    react({
      // Babel fast-refresh is already on by default; babel config kept minimal
    }),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Increase the warning threshold to avoid noise from big icon packages
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Manual chunk splitting for predictable caching
        manualChunks(id) {
          // Vendor: React ecosystem
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          // Vendor: React Router
          if (id.includes("node_modules/react-router")) {
            return "vendor-router";
          }
          // Vendor: Radix UI primitives (used by shadcn)
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix";
          }
          // Vendor: Hugeicons (large icon set)
          if (id.includes("node_modules/@hugeicons")) {
            return "vendor-icons";
          }
          // Everything else in node_modules goes into a generic vendor chunk
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },

    // Minify with oxc (Vite 8 default, fastest option — esbuild is deprecated in v8)
    minify: "oxc",

    // Generate source maps only in development (comment out for prod analysis)
    sourcemap: false,

    // Target modern browsers for smaller output
    target: "esnext",
  },

  // Optimise pre-bundling so large icon packages don't slow cold starts
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@hugeicons/react",
      "@hugeicons/core-free-icons",
    ],
  },
})