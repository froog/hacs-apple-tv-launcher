import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/apple-tv-launcher-card.ts",
      formats: ["es"],
      fileName: () => "apple-tv-launcher-card.js",
    },
    outDir: "custom_components/apple_tv_launcher/frontend",
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
    include: ["tests/frontend/**/*.test.ts"],
  },
});
