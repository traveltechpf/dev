import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  // Build straight into Spring's static
  const outputDir = path.resolve(
    __dirname,
    "../Backend/travel-platform/src/main/resources/static"
  );

  return {
    plugins: [react()],
    base: "/",                           // ensure absolute URLs in index.html

    build: {
      outDir: outputDir,
      emptyOutDir: true,
      sourcemap: !isProduction,

      rollupOptions: {
        // Name the two entry files you want to include from JSP
        input: {
          main: path.resolve(__dirname, "src/main.jsx"),
          api: path.resolve(__dirname, "src/services/api.js"),
        },
        output: {
          entryFileNames: "js/[name].js",   // no hashes
          chunkFileNames: "js/[name].js",   // no hashes
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || "asset";
            const ext = name.substring(name.lastIndexOf(".")+1).toLowerCase();
            const folder =
              /png|jpe?g|svg|gif|tiff|bmp|ico/.test(ext) ? "images" :
              /css|scss/.test(ext) ? "css" :
              /otf|woff2?|ttf/.test(ext) ? "fonts" : "assets";
            return `${folder}/[name][extname]`;
          },
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            api: ["axios"],
          },
        },
      },

      target: "es2015",
      minify: isProduction ? "esbuild" : false,
      cssCodeSplit: true,
    },

    server: {
      port: 3000,
      host: "0.0.0.0",
      proxy: { "/api": { target: "http://localhost:8080", changeOrigin: true, secure: false } },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@services": path.resolve(__dirname, "src/services"),
        "@styles": path.resolve(__dirname, "src/styles"),
      },
    },

    define: { __DEV__: !isProduction, __PROD__: isProduction },
  };
});