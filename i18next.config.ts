import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: [
    "es",
    "en"
  ],
  extract: {
    input: "src/**/*.{jsx,ts}",
    output: "public/locales/{{language}}/{{namespace}}.json"
  }
});