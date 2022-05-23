import { readFile } from "fs/promises";
import { dirname, relative } from "path";
import { build } from "esbuild";
import { compile } from "svelte/compiler";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import * as process from "process";

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
       * @param b
       */
      setup(b) {
        b.onLoad({ filter: /\.ts$/ }, async ({ path }) => ({
          contents: stripGraphQLTag((await readFile(path)).toString()),
          loader: "ts",
        }));
      },
    },
    {
      name: "include-svg",
      /**
       * This plugin converts SVG icons to Svelte components. Additionally, icons
       * can be resized via a "size" property (they are always square).
       * @param b
       */
      setup(b) {
        b.onLoad({ filter: /\.svg$/ }, async ({ path }) => {
          const svgContent = (await readFile(path)).toString();
          const svelteSvg = `<script>
  export let size = 24;
</script>

${svgContent.replace(
  "<svg",
  "<svg style={`width:${size}px;height:${size}px`}"
)}`;

          const { js } = compile(svelteSvg, {
            filename: relative(process.cwd(), path),
          });
          const compiled =
            js.code +
            "\n//# sourceMappingURL=data:application/json;charset=utf-8;base64," +
            Buffer.from(js.map.toString()).toString("base64");

          return {
            resolveDir: dirname(path),
            contents: compiled,
            loader: "js",
          };
        });
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
