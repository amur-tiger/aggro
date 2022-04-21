import { build } from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const watch = process.argv.some((arg) => arg === "--watch");

build({
  plugins: [
    sveltePlugin({
      preprocess: sveltePreprocess({
        postcss: {
          plugins: [autoprefixer()],
        },
      }),
    }),
  ],
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: !watch,
  sourcemap: true,
  watch: watch && {
    onRebuild(error) {
      if (error) {
        console.error(error);
      } else {
        console.log("Rebuilt after changes");
      }
    },
  },
  outfile: "./public/bundle.js",
}).catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
