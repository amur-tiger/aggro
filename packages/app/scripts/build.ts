import { readFile } from "fs/promises";
import { basename, dirname, parse } from "path";
import * as process from "process";
import { build } from "esbuild";
import autoprefixer from "autoprefixer";
import { sassPlugin } from "esbuild-sass-plugin";
import postcss from "postcss";

// @ts-ignore
import { transformAsync } from "@babel/core";
// @ts-ignore
import ts from "@babel/preset-typescript";
// @ts-ignore
import solid from "babel-preset-solid";

const watch = process.argv.some((arg) => arg === "--watch");

function stripGraphQLTag(contents: string): string {
  if (!contents.includes("gql`")) {
    return contents;
  }
  return contents.replaceAll('import { gql } from "graphql-tag";', "").replaceAll(
    /gql`([^`]*)`/gm,
    (_str, query) =>
      `\`${query
        .replaceAll(/\s+/gm, " ")
        .replaceAll(/\s+([{}])\s+/g, "$1")
        .trim()}\``
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
        b.onLoad({ filter: /\.tsx?$/ }, async ({ path }) => {
          const source = await readFile(path, { encoding: "utf-8" });
          const { name, ext } = parse(path);
          const { code } = await transformAsync(stripGraphQLTag(source), {
            presets: [solid, ts],
            filename: name + ext,
            sourceMaps: "inline",
          });
          return { contents: code, loader: "js" };
        });
      },
    },
    {
      name: "include-svg",
      /**
       * This plugin converts SVG icons to SolidJS components. Additionally, icons
       * can be resized via a "size" property (they are always square).
       * @param b
       */
      setup(b) {
        b.onLoad({ filter: /\.svg$/ }, async ({ path }) => {
          const svgContent = (await readFile(path)).toString().trim().replaceAll(/\s+/g, " ").replaceAll(/> </g, "><");
          const componentName = basename(path, ".svg");
          const componentSvg = `
            import { setAttribute, template } from "solid-js/web";

            const tpl = template(\`${svgContent}\`);

            export default function ${componentName}({ size, width, height }) {
              return (() => {
                const el = tpl.cloneNode(true);
                if (size) {
                  setAttribute(el, "width", size);
                  setAttribute(el, "height", size);
                } else {
                  if (width) {
                    setAttribute(el, "width", width);
                  }
                  if (height) {
                    setAttribute(el, "height", height);
                  }
                }
                return el;
              })();
            }`;

          return {
            resolveDir: dirname(path),
            contents: componentSvg,
            loader: "tsx",
          };
        });
      },
    },
    sassPlugin({
      type: "css",
      transform: async (source) => {
        const { css } = await postcss([autoprefixer]).process(source);
        return css;
      },
    }),
  ],
  entryPoints: ["./src/index.tsx"],
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
