import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/EtkinLink_web/",
  optimizeDeps: {
    exclude: [
      "@supabase/supabase-js",
      "@supabase/auth-js",
      "@supabase/functions-js",
      "@supabase/realtime-js",
      "@supabase/postgrest-js",
      "@supabase/storage-js",
    ],
  },
  build: {
    target: "es2022",
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, "index.html"),
        kvkk: resolve(import.meta.dirname, "legal/kvkk.html"),
        privacy: resolve(import.meta.dirname, "legal/privacy.html"),
        terms: resolve(import.meta.dirname, "legal/terms.html"),
        childSafety: resolve(import.meta.dirname, "legal/child-safety.html"),
        community: resolve(import.meta.dirname, "legal/community.html"),
        accountDeletion: resolve(
          import.meta.dirname,
          "legal/account-deletion.html",
        ),
        confirm: resolve(import.meta.dirname, "auth/confirm.html"),
        resetPassword: resolve(import.meta.dirname, "auth/reset-password.html"),
        support: resolve(import.meta.dirname, "support.html"),
        notFound: resolve(import.meta.dirname, "404.html"),
      },
    },
  },
});
