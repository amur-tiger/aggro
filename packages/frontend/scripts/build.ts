import { readFile } from "fs/promises";
import { build } from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const watch = process.argv.some((arg) => arg === "--watch");

function stripGraphQLTag(contents: string): string {
  if (!contents.includes("gql`")) {
    return contents;
  }
  return contents
    .replaceAll('import { gql } from "graphql-tag";', "")
    .replaceAll(
      /gql`([^`]*)`/gm,
      (_str, query) => `\`${query.replaceAll(/\s+/gm, " ").trim()}\``
    );
}

build({
  plugins: [
    {
      name: "strip-graphql-tag",
      /**
       * This preprocessor strips "graphql-tag" and inserts queries as strings,
       * so it's one less dependency in the bundle
       * @param build
       */
      setup(build) {
        build.onLoad({ filter: /\.ts$/ }, async ({ path }) => ({
          contents: stripGraphQLTag((await readFile(path)).toString()),
          loader: "ts",
        }));
      },
    },
    sveltePlugin({
      preprocess: [
        {
          /**
           * This preprocessor strips "graphql-tag" and inserts queries as strings,
           * so it's one less dependency in the bundle
           * @param content
           */
          script: ({ content }) => ({
            code: stripGraphQLTag(content),
          }),
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
