import { build } from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const watch = process.argv.some((arg) => arg === "--watch");

build({
  plugins: [
    sveltePlugin({
      preprocess: [
        {
          /**
           * This preprocessor strips "graphql-tag" and inserts queries as strings,
           * so it's one less dependency in the bundle
           * @param content
           */
          script({ content }) {
            if (!content.includes("gql`")) {
              return undefined;
            }

            content = content.replaceAll(
              'import { gql } from "graphql-tag";',
              ""
            );

            content = content.replaceAll(
              /gql`([^`]*)`/gm,
              (_str, query) => `\`${query.replaceAll(/\s+/gm, " ").trim()}\``
            );

            return {
              code: content,
            };
          },
        },
        sveltePreprocess({
          postcss: {
            plugins: [autoprefixer()],
          },
        }),
      ],
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
