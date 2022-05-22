import { existsSync, unlinkSync } from "fs";
import { lstat, readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { sync as glob } from "glob";
import { watch } from "chokidar";

if (process.argv.length < 3) {
  console.error("Error: Need at least one folder as command line argument");
  process.exit(1);
}

const watchFlag = process.argv.some((arg) => arg === "--watch");
const sources = process.argv.slice(2).filter((arg) => arg !== "--watch");

(async () => {
  const expandedSources = (
    await Promise.all(
      sources.map(async (source) => {
        const result: string[] = [];
        const matches = glob(source);
        for (const match of matches) {
          const stat = await lstat(match);
          if (stat.isDirectory()) {
            result.push(match);
          }
        }
        return result;
      })
    )
  ).flat();

  if (watchFlag) {
    watch(
      expandedSources.map((s) => `${s}/**/!(index).ts`),
      {
        awaitWriteFinish: true,
      }
    ).on("all", (_, path) => {
      path = path.replace(/\\/g, "/");
      const root = expandedSources.find((s) => path.startsWith(s));
      writeRootIndex(root).catch((err) => {
        console.error(err);
        process.exit(1);
      });
    });
  } else {
    for (const source of expandedSources) {
      await writeRootIndex(source);
    }
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function writeRootIndex(root: string): Promise<void> {
  let content = `/* eslint-disable */
/* istanbul ignore file */
// @generated
// This file was auto-generated. Do not edit, your changes will be overwritten!

`;

  const indexPath = join(root, "/index.ts");

  if (existsSync(indexPath)) {
    unlinkSync(indexPath);
  }

  content += await getIndex(root, root);

  console.log(" \x1b[32m*\x1b[0m %s", indexPath);
  await writeFile(indexPath, content);
}

async function getIndex(root: string, directory: string): Promise<string> {
  let content = "";
  const filenames = await readdir(join(directory));

  for (const filename of filenames) {
    const path = join(directory, filename);
    const stat = await lstat(path);

    if (stat.isDirectory()) {
      content += await getIndex(root, path);
    } else {
      content += await getContent(root, path);
    }
  }

  return content;
}

async function getContent(root: string, filepath: string): Promise<string> {
  let content = "";

  const fileContent = await readFile(filepath, "utf-8");
  const exportPath = filepath
    .split("\\")
    .join("/")
    .split(root)[1]
    .split(".")[0];

  const exportsContent = fileContent
    .toString()
    .split("\n")
    .filter(
      (line) =>
        line.includes("export abstract class") ||
        line.includes("export class") ||
        (line.includes("export const") &&
          !line.includes("export const enum")) ||
        line.includes("export enum") ||
        line.includes("export function")
    );

  const exports = getExports(exportsContent);
  if (exports.length) {
    content += `export { ${exports.join(", ")} } from '.${exportPath}';\n`;
  }

  const typeExportsContent = fileContent
    .toString()
    .split("\n")
    .filter(
      (line) =>
        line.includes("export type") ||
        line.includes("export interface") ||
        line.includes("export const enum")
    );

  const typeExports = getExports(typeExportsContent);
  if (typeExports.length) {
    content += `export type { ${typeExports.join(
      ", "
    )} } from '.${exportPath}';\n`;
  }

  return content;
}

function getExports(lines: string[]): string[] {
  const exports: string[] = [];

  for (const line of lines) {
    let name = line.split(" ")[2];
    if (name === "enum" || name === "class") {
      name = line.split(" ")[3];
    }

    name = name.includes("<") ? name.split("<")[0] : name;
    name = name.includes("(") ? name.split("(")[0] : name;
    name = name.includes(":") ? name.split(":")[0] : name;

    if (!exports.includes(name)) {
      exports.push(name);
    }
  }

  return exports;
}
