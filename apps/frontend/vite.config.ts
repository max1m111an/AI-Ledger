import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
    plugins: [ react() ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@utils": path.resolve(__dirname, "./src/utils"),
            "@interfaces": path.resolve(__dirname, "./src/interfaces"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@api": path.resolve(__dirname, "./src/api"),
            "@widgets": path.resolve(__dirname, "./src/widgets"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: "@use \"@assets/scss/consts\" as *;",
            },
        },
    },
});
