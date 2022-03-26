import { join } from "path";
import { existsSync } from "fs";
import { build } from "esbuild";
import sveltePlugin from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const watch = process.argv.some((arg) => arg === "--watch");
const sassIncludePaths = [
    join(__dirname, "../node_modules"),
    join(__dirname, "../../../node_modules"),
];

build({
    plugins: [
        sveltePlugin({
            preprocess: sveltePreprocess({
                sass: {
                    includePaths: sassIncludePaths,
                    importer: (url: string) => {
                        // custom importer to support hoisted Sass modules
                        if (!url.startsWith("~")) {
                            return null;
                        }
                        for (const path of sassIncludePaths) {
                            const modulePath = join(path, url.substring(1));
                            if (existsSync(modulePath)) {
                                return { file: modulePath };
                            }
                        }
                        return new Error(`Unable to find module "${url.substring(1)}"`);
                    },
                },
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
    watch: watch,
    outfile: "./public/bundle.js",
}).catch((err: Error) => {
    console.error(err);
    process.exit(1);
});
