import { resolve } from "node:path";
import { defineConfig, type Plugin, type Rollup } from "vite";

const page = (path: string) => resolve(import.meta.dirname, path);

const modulePreloadPolyfillImport = 'import "vite/modulepreload-polyfill";\n';

/**
 * The archived legal texts (`legal/*-2026-09-14.html`) must keep the bytes
 * they were published with. They are the only pages that load `src/site.ts`
 * (with the frozen `src/styles.css`), and their HTML names the script chunk
 * built from it and that chunk's stylesheet, so neither name may change.
 *
 * The stylesheet keeps its name because `src/styles.css` stays frozen and its
 * hash comes from its content. The script's hash would follow every edit to
 * `src/site.ts`, so its published name is pinned here instead.
 */
const frozenSiteChunk = "assets/site-BzGedLMH.js";
const hashedChunk = "assets/[name]-[hash].js";

const isFrozenSiteChunk = (chunk: Rollup.PreRenderedChunk): boolean =>
  chunk.name === "site" &&
  chunk.moduleIds.some((id) => id.replace(/\\/g, "/").endsWith("/src/site.ts"));

const chunkFileName = (chunk: Rollup.PreRenderedChunk): string =>
  isFrozenSiteChunk(chunk) ? frozenSiteChunk : hashedChunk;

/**
 * Vite imports its modulepreload polyfill into every page, and Rollup puts a
 * module in the chunk shared by the pages that import it. If the pages on
 * `src/main.ts` imported the polyfill too, it would move into a chunk of its
 * own, the archived pages would gain a `<link rel="modulepreload">` to that
 * chunk and their bytes would change. Only pages that load `src/site.ts` keep
 * the polyfill; it only speeds up `<link rel="modulepreload">` in browsers
 * that lack it.
 */
function keepFrozenSiteChunk(): Plugin {
  return {
    name: "etkinlink:keep-frozen-site-chunk",
    apply: "build",
    enforce: "post",
    transform(code, id) {
      if (!id.endsWith(".html") || code.includes('import "/src/site.ts"')) {
        return null;
      }
      if (!code.includes(modulePreloadPolyfillImport)) return null;
      return {
        code: code.replace(modulePreloadPolyfillImport, ""),
        map: null,
      };
    },
  };
}

export default defineConfig({
  base: "/EtkinLink_web/",
  plugins: [keepFrozenSiteChunk()],
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
      output: {
        entryFileNames: chunkFileName,
        chunkFileNames: chunkFileName,
      },
      input: {
        home: page("index.html"),
        kvkk: page("legal/kvkk.html"),
        privacy: page("legal/privacy.html"),
        terms: page("legal/terms.html"),
        kvkk20260914: page("legal/kvkk-2026-09-14.html"),
        privacy20260914: page("legal/privacy-2026-09-14.html"),
        terms20260914: page("legal/terms-2026-09-14.html"),
        kvkk20261021: page("legal/kvkk-2026-10-21.html"),
        privacy20261021: page("legal/privacy-2026-10-21.html"),
        terms20261021: page("legal/terms-2026-10-21.html"),
        kvkk20261027: page("legal/kvkk-2026-10-27.html"),
        privacy20261027: page("legal/privacy-2026-10-27.html"),
        childSafety: page("legal/child-safety.html"),
        community: page("legal/community.html"),
        accountDeletion: page("legal/account-deletion.html"),
        confirm: page("auth/confirm.html"),
        resetPassword: page("auth/reset-password.html"),
        support: page("support.html"),
        notFound: page("404.html"),
      },
    },
  },
});
